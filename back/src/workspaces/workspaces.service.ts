import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: { WorkspaceMembers: [{ UserId: myId }] },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    console.log('createWorkspace', name, url, myId);
    // TODO: transaction 으로 리펙토링 해보자
    const workspace = new Workspaces();
    workspace.name = name;
    workspace.url = url;
    workspace.OwnerId = myId;
    const returned = await this.workspacesRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    // await this.workspaceMembersRepository.save(workspaceMember);

    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    // const channelReturned = await this.channelsRepository.save(channel);

    const [, channelReturned] = await Promise.all([
      this.workspaceMembersRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);

    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // relations: ['channels'], // 아래 join 과 동일
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    // query builder 로 작성
    // this.workspacesRepository
    //   .createQueryBuilder('workspace')
    //   .innerJoinAndSelect('workspace.Channels', 'channels')
    //   .getOne();

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
