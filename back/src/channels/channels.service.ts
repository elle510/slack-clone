import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Workspaces } from 'src/entities/Workspaces';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Users } from 'src/entities/Users';
import { EventsGateway } from 'src/events/events.gateway';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    // 위 쿼리빌더를 메소드 방식으로 구현
    // return this.channelsRepository.findOne({
    //   where: { name },
    //   relations: ['Workspace'],
    // });
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const channel = new Channels();
    channel.name = name;
    channel.WorkspaceId = workspace.id;
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
        name,
      })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany();
  }

  async createWorkspaceChannelMembers(url, name, email) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    if (!channel) {
      // return null; // TODO: 이 때 어떻게 에러 발생?
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getOne();
    if (!user) {
      // return null;
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channelChats.User', 'user')
      .orderBy('channelChats.createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    myId: number,
  ) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }

    const chats = new ChannelChats();
    chats.content = content;
    chats.UserId = myId;
    chats.ChannelId = channel.id;
    const savedChat = await this.channelChatsRepository.save(chats);
    // savedChat.Channel = channel;
    // savedChat.User = user;
    // 위의 주석과 아래 쿼리는 동일함.(myId 대신 user를 파라미터로 받는다.)
    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['User', 'Channel'],
    });

    // socket.io 로 워크스페이스+채널 사용자에게 전송
    // TODO: join() 없이 to() 한 것은 알아보자.
    this.eventsGateway.server
      // .of(`/ws-${url}`)
      .to(`/ws-${url}-${chatWithUser.ChannelId}`)
      .emit('message', chatWithUser);
  }

  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: string[], // Express.Multer.File[],
    myId: number,
  ) {
    console.log(files);
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    for (let i = 0; i < files.length; i++) {
      const chats = new ChannelChats();
      // chats.content = files[i].path;
      chats.UserId = myId;
      chats.ChannelId = channel.id;
      const savedChat = await this.channelChatsRepository.save(chats);
      const chatWithUser = await this.channelChatsRepository.findOne({
        where: { id: savedChat.id },
        relations: ['User', 'Channel'],
      });

      // TODO: join() 없이 to() 한 것은 알아보자.
      this.eventsGateway.server
        // .of(`/ws-${url}`)
        .to(`/ws-${url}-${chatWithUser.ChannelId}`)
        .emit('message', chatWithUser);
    }
  }

  async getChannelUnreadsCount(url, name, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    return this.channelChatsRepository.count({
      // COUNT(*)
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)), // createdAt > 오늘 (연산자 사용이 힘들다면 그냥 쿼리빌더로 작성)
      },
    });
  }
}
