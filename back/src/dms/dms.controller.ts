import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { DmsService } from './dms.service';

@ApiTags('DM')
// 컨트롤러 이름이 url 과 꼭 일치시킬 필요는 없음 - 필요에 따라 url 정해주면 됨
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private dmsService: DmsService) {}

  @ApiOperation({ summary: '워크스페이스 DM 모두 가져오기' })
  @Get()
  async getWorkspaceChannels(@Param('url') url, @User() user: Users) {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' })
  @ApiParam({ name: 'url', description: '워크스페이스 url', required: true })
  @ApiParam({ name: 'id', description: '사용자 아이디', required: true })
  @ApiQuery({
    name: 'perPage',
    description: '한 번에 가져오는 개수',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: '불러올 페이지',
    required: true,
  })
  @Get(':id/chats')
  async getWorkspaceDMChats(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
    @User() user: Users,
  ) {
    return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
  }

  @ApiOperation({ summary: '워크스페이스 특정 DM 채팅 생성하기' })
  @Post(':id/chats')
  async createWorkspaceDMChats(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
    @Body('content') content: string,
    @User() user: Users,
  ) {
    return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
  }

  // @ApiOperation({ summary: '워크스페이스 특정 DM 이미지 업로드하기' })
  // @UseInterceptors(
  //   FilesInterceptor('image', 10, {
  //     storage: multer.diskStorage({
  //       destination(req, file, cb) {
  //         cb(null, 'uploads/');
  //       },
  //       filename(req, file, cb) {
  //         const ext = path.extname(file.originalname);
  //         cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  //       },
  //     }),
  //     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  //   }),
  // )
  // @Post(':id/images')
  // async createWorkspaceDMImages(
  //   @Param('url') url,
  //   @Param('id', ParseIntPipe) id: number,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @User() user: Users,
  // ) {
  //   return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
  // }

  @ApiOperation({ summary: '안 읽은 개수 가져오기' })
  @Get(':id/unreads')
  async getUnreads(
    @Param('url') url,
    @Param('id', ParseIntPipe) id: number,
    @Query('after', ParseIntPipe) after: number,
    @User() user: Users,
  ) {
    return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
  }
}
