import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthSigninDto} from "./dto/auth.signin.dto";
import {AuthSignupDto} from "./dto/auth.signup.dto";
import {Public} from "../common/decorators/public.decorator";
import {RtGuard} from "../common/guards/rt.guard";
import {GetPayloadRtData} from "../common/decorators/get-payload-rt-data.decorator";
import {JwtPayload} from "./types/jwtPayload.type";
import {Request, Response} from "Express";
import {UsernameDto} from "./dto/username.dto";
import {UpdatePasswordDto} from "./dto/update-password.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthSignupDto, @Res() res: Response) {
    await this.authService.signup(dto);
    res.json({
      message: 'User created successfully',
    })
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthSigninDto, @Res() res: Response) {
    const { access_token, refresh_token, device_id} = await this.authService.signin(dto);

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('deviceId', device_id, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.json({ access_token });
  }

  @Get('username')
  @HttpCode(HttpStatus.OK)
  async getUserName(@Res() res: Response, @Req() req: Request) {
    const user = req.user as JwtPayload;
    const message = await this.authService.getUserName(user.sub);
    res.json(message);
  }

  @Put('username')
  @HttpCode(HttpStatus.OK)
  async updateUserName(@Body() dto: UsernameDto, @Res() res: Response, @Req() req: Request) {
    const user = req.user as JwtPayload;
    const message = await this.authService.updateUserName(user.sub, dto.userName);
    res.json(message);
  }

  @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
      @GetPayloadRtData('sub') user_id: string,
      @GetPayloadRtData('deviceId') deviceId: string,
      @Res() res: Response
  ) {
    await this.authService.logout(user_id, deviceId);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.clearCookie('deviceId', {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    return res.json({
      message: 'Logging out successful',
    });
  }

  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
      @GetPayloadRtData('sub') user_id: string,
      @GetPayloadRtData('deviceId') deviceId: string,
      @GetPayloadRtData('refreshToken') rt: string,
      @Res() res: Response
  ) {
    const { access_token, refresh_token, device_id} = await this.authService.refresh(user_id, rt, deviceId);

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('deviceId', device_id, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.json({ access_token });
  }

  @UseGuards(RtGuard)
  @Delete('user')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@GetPayloadRtData('sub') user_id: string, @Req() req: Request, @Res() res: Response) {
    const message = await this.authService.deleteUser(user_id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.clearCookie('deviceId', {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.json(message);
  }

  @UseGuards(RtGuard)
  @Put('password')
  @HttpCode(HttpStatus.OK)
  async updatePassword(
      @Body() dto: UpdatePasswordDto,
      @GetPayloadRtData('sub') user_id: string,
      @Res() res: Response
      ) {
    const data = await this.authService.updatePassword(dto.oldPassword, dto.newPassword, user_id);
    res.cookie('refreshToken', data.newTokens.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.cookie('deviceId', data.newTokens.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res.json(data.message);
  }
}
