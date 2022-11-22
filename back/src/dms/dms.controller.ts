import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
// 컨트롤러 이름이 url 과 꼭 일치시킬 필요는 없음 - 필요에 따라 url 정해주면 됨
@Controller('api/workspaces/:url/dms')
export class DmsController {
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
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':id/chats')
  postChats(@Body() body) {}
}
