import { User } from "discord.js";
import { prisma } from "./Prisma";

export async function createUser(discord_user: User) {
    return await prisma.user.create({
        data: {
            id: discord_user.id,
            created_at: discord_user.createdAt,
            username: discord_user.username,
            accent_color: discord_user.accentColor,
            avatar: discord_user.displayAvatarURL({ forceStatic: false, extension: 'png', size: 1024 }),
            banner: discord_user.bannerURL({ forceStatic: false, extension: 'png', size: 4096 }),
            global_name: discord_user.globalName,
        }
    });
}

export async function getUserById(id: string) {
    return await prisma.user.findUnique({
        where: { id }
    });
}

export async function getUser(discord_user: User) {
    let user = await prisma.user.findFirst({ where: { id: discord_user.id } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                id: discord_user.id,
                created_at: discord_user.createdAt,
                username: discord_user.username,
                accent_color: discord_user.accentColor,
                avatar: discord_user.displayAvatarURL({ forceStatic: false, extension: 'png', size: 1024 }),
                banner: discord_user.bannerURL({ forceStatic: false, extension: 'png', size: 4096 }),
                global_name: discord_user.globalName,
            }
        })
    }
    return user;
}

export async function deleteUser(id: string) {
    return await prisma.user.delete({
        where: { id }
    });
}