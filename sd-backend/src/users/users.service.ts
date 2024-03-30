import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(email: string, passwordHash: string, userName: string) {
        const isEmail = !!(await this.prisma.user.findUnique({ where: { email } }));
        const isUsername = !!(await this.prisma.user.findUnique({ where: { user_name: userName } }));

        if (isEmail) {
            throw new ForbiddenException('Email is already in use.');
        }
        if (isUsername) {
            throw new ForbiddenException('Username is already taken.');
        }

        return this.prisma.user.create({
            data: {
                email,
                user_name: userName,
                password_hash: passwordHash,
            }
        });
    }


    async findOneByEmail(email: string) {
        return this.prisma.user.findUnique({where: {email}});
    }

    async findOneById(id: string) {
        return this.prisma.user.findUnique({where: {user_id: id}})
    }

    async find(email: string) {
        return this.prisma.user.findMany({where: {email}})
    }

    async updatePassword(id: string, passwordHash: string) {
        return this.prisma.user.update({
            where: {
                user_id: id,
            },
            data: {
                password_hash: passwordHash,
            }
        });
    }

    async updateUserName(id: string, newUserName: string) {
        return this.prisma.user.update({
            where: {
                user_id: id,
            },
            data: {
                user_name: newUserName,
            }
        });
    }

    async remove(id: string) {
        return this.prisma.user.delete({where: {user_id: id}});
    }

    async isExist(id: string) {
        const result = await this.prisma.user.findMany({where: {user_id: id}});
        return result.length != 0;
    }

    async isExistUserName(userName: string) {
        const result = await this.prisma.user.findMany({where: {user_name: userName}});
        return result.length > 0;
    }
}
