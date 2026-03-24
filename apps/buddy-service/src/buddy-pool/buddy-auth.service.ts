import { ConflictException, Injectable } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma.service";
import { LoginBuddyDto, RegisterBuddyDto } from "./dto";

@Injectable()
export class BuddyAuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterBuddyDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone: dto.phone }]
      }
    });
    if (existing) {
      throw new ConflictException(
        "An account with this email or phone already exists."
      );
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const helper = await this.prisma.user.create({
      data: {
        name: dto.name,
        displayName: dto.name,
        email,
        phone: dto.phone,
        passwordHash,
        role: "buddy",
        isAvailable: false,
        lat: dto.location.lat,
        lng: dto.location.lng,
        locationLabel: dto.location.label,
        radiusKm: dto.radiusKm,
        profilePhotoUrl: dto.profilePhotoUrl,
        idNumber: dto.idNumber,
        skills: {
          create: dto.skills.map((skill) => ({ taskType: skill }))
        }
      }
    });

    return {
      id: helper.id,
      name: helper.displayName ?? helper.name ?? helper.email.split("@")[0],
      email: helper.email,
      status: helper.status,
      role: "buddy"
    };
  }

  async login(dto: LoginBuddyDto) {
    const helper = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() }
    });

    if (!helper || helper.role !== "buddy") {
      return null;
    }

    const isValid = await bcrypt.compare(dto.password, helper.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: helper.id,
      name: helper.displayName ?? helper.name ?? helper.email.split("@")[0],
      email: helper.email,
      status: helper.status,
      role: "buddy"
    };
  }
}
