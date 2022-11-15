import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

// 컨트롤러 이름이 url 과 꼭 일치시킬 필요는 없음 - 필요에 따라 url 정해주면 됨
@Controller('api/workspaces/:url/dms')
export class DmsController {
  @Get(':id/chats')
  getChats(@Query() query, @Param() param) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':id/chats')
  postChats(@Body() body) {}
}
