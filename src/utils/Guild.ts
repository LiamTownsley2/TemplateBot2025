import { Guild } from "discord.js";
import { prisma } from "./Prisma";

export async function createGuild(guild: Guild) {
    return await prisma.guild.create({
        data: {
            id: guild.id,
            name: guild.name,
            created_at: new Date(),
            last_active: new Date(),
        }
    });
}

export async function getGuild(guild: Guild) {
    let db_guild = await prisma.guild.findFirst({ where: { id: guild.id } });
    if (!db_guild) {
        db_guild = await prisma.guild.create({
            data: {
                id: guild.id,
                name: guild.name,
                created_at: new Date(),
                last_active: new Date(),
            }
        })
    }
    return db_guild;
}

export async function deleteGuild(id: string) {
    return await prisma.guild.delete({
        where: { id }
    });
}