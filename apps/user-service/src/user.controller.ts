import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get()
  listUsers(@Query("role") role?: string) {
    return this.users.listUsers(role);
  }

  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.users.getUser(id);
  }

  @Patch(":id")
  updateUser(
    @Param("id") id: string,
    @Body()
    payload: {
      name?: string;
      displayName?: string;
      email?: string;
      phone?: string;
      profilePhotoUrl?: string;
      locationLabel?: string;
      lat?: number;
      lng?: number;
    }
  ) {
    return this.users.updateUser(id, payload);
  }
}
