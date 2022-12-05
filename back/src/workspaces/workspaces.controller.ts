import {
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@ApiTags('WORKSPACE')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @ApiOperation({ summary: '내 워크스페이스 가져오기' })
  @Get()
  async getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @ApiOperation({ summary: '워크스페이스 만들기' })
  @Post()
  async createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  @ApiOperation({ summary: '워크스페이스 멤버 가져오기' })
  @Get(':url/members')
  async getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @ApiOperation({ summary: '워크스페이스 멤버 초대하기' })
  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body('email') email: string,
  ) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  // @Delete(':url/members/:id')
  // kickMemberFromWorkspace() {}

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/members/:id')
  async getMemberInfoInWorkspace(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/users/:id')
  async DEPRECATED_getMemberInfoInWorkspace(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
