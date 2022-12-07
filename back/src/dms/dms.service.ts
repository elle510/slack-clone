import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DMs } from 'src/entities/DMs';
import { Users } from 'src/entities/Users';
import { Workspaces } from 'src/entities/Workspaces';
import { EventsGateway } from 'src/events/events.gateway';
import { onlineMap } from 'src/events/onlineMap';
import { MoreThan, Repository } from 'typeorm';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

@Injectable()
export class DmsService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(DMs) private dmsRepository: Repository<DMs>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async getWorkspaceDMs(url: string, myId: number) {
    return (
      this.usersRepository
        .createQueryBuilder('user')
        .leftJoin('user.dms', 'dms', 'dms.senderId = :myId', { myId })
        .leftJoin('dms', 'workspace', 'workspace.url = :url', { url })
        // .groupBy('dms.senderId')
        .getMany()
    );
  }

  async getWorkspaceDMChats(
    url: string,
    id: number,
    myId: number,
    perPage: number,
    page: number,
  ) {
    return this.dmsRepository
      .createQueryBuilder('dms')
      .innerJoinAndSelect('dms.Sender', 'sender')
      .innerJoinAndSelect('dms.Receiver', 'receiver')
      .innerJoin('dms.Workspace', 'workspace')
      .where('workspace.url = :url', { url })
      .andWhere(
        '((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))',
        { id, myId },
      )
      .orderBy('dms.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceDMChats(
    url: string,
    content: string,
    id: number,
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const dm = new DMs();
    dm.SenderId = myId;
    dm.ReceiverId = id;
    dm.content = content;
    dm.WorkspaceId = workspace.id;
    const savedDm = await this.dmsRepository.save(dm);
    const dmWithSender = await this.dmsRepository.findOne({
      where: { id: savedDm.id },
      relations: ['Sender'],
    });

    // socket.io 전송
    const receiverSocketId = getKeyByValue(
      onlineMap[`/ws-${workspace.url}`],
      Number(id),
    );
    this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
  }

  async createWorkspaceDMImages(
    url: string,
    files: string[], // Express.Multer.File[],
    id: number,
    myId: number,
  ) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    for (let i = 0; i < files.length; i++) {
      const dm = new DMs();
      dm.SenderId = myId;
      dm.ReceiverId = id;
      // dm.content = files[i].path;
      dm.WorkspaceId = workspace.id;
      const savedDm = await this.dmsRepository.save(dm);
      const dmWithSender = await this.dmsRepository.findOne({
        where: { id: savedDm.id },
        relations: ['Sender'],
      });

      // socket.io 전송
      const receiverSocketId = getKeyByValue(
        onlineMap[`/ws-${workspace.url}`],
        Number(id),
      );
      this.eventsGateway.server.to(receiverSocketId).emit('dm', dmWithSender);
    }
  }

  async getDMUnreadsCount(url, id, myId, after) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    return this.dmsRepository.count({
      where: {
        WorkspaceId: workspace.id,
        SenderId: id,
        ReceiverId: myId,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }
}
