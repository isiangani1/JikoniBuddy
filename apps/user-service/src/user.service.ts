import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        rating: true,
        profilePhotoUrl: true,
        locationLabel: true,
        lat: true,
        lng: true,
        createdAt: true
      }
    });
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }

  async listUsers(role?: string) {
    return this.prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }

  async updateUser(
    id: string,
    payload: Partial<{
      name: string;
      displayName: string;
      email: string;
      phone: string;
      profilePhotoUrl: string;
      locationLabel: string;
      lat: number;
      lng: number;
    }>
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found.");

    return this.prisma.user.update({
      where: { id },
      data: {
        name: payload.name ?? undefined,
        displayName: payload.displayName ?? undefined,
        email: payload.email ?? undefined,
        phone: payload.phone ?? undefined,
        profilePhotoUrl: payload.profilePhotoUrl ?? undefined,
        locationLabel: payload.locationLabel ?? undefined,
        lat: payload.lat ?? undefined,
        lng: payload.lng ?? undefined
      }
    });
  }
}
