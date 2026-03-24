import { Body, Controller, Post } from "@nestjs/common";
import { BuddyAuthService } from "./buddy-auth.service";
import { LoginBuddyDto, RegisterBuddyDto } from "./dto";

@Controller("buddy/auth")
export class BuddyAuthController {
  constructor(private readonly authService: BuddyAuthService) {}

  @Post("register")
  register(@Body() dto: RegisterBuddyDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginBuddyDto) {
    return this.authService.login(dto);
  }
}
