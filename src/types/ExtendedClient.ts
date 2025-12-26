import { Client, ClientEvents, Collection, GatewayIntentBits, User } from 'discord.js';
import { Command } from './interfaces/Command/Command';
import { Event } from './interfaces/Event';
import { CommandHandler } from '../handlers/CommandHandler';
import { EventHandler } from '../handlers/EventHandler';
import { logger, LogHandler } from '../handlers/LogHandler';
import { getI18n } from '../utils/I18n';
import { getUser } from '../utils/User';

export class ExtendedClient extends Client {
  public commands: Collection<string, Command>;
  public events: Collection<string, Event<keyof ClientEvents>>;
  public commandHandler: CommandHandler;
  public eventHandler: EventHandler;
  public logHandler: LogHandler;
  public database: any;
  public config: any;

  constructor(directories: { command: string, event: string }) {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ],
    });
    this.commands = new Collection<string, Command>();
    this.events = new Collection<string, Event<keyof ClientEvents>>();
    this.commandHandler = new CommandHandler(this, directories.command);
    this.eventHandler = new EventHandler(this, directories.event);
    this.logHandler = LogHandler.getInstance();
    this.database = {};
    this.config = {};

    this.on('error', (error) => logger.error('Client Error:', { error }));
    this.on('warn', (info) => logger.warn('Client Warning:', { info }));
    this.on('debug', (info) => logger.debug('Client Debug:', { info }));
  }

  public async getI18nForUser(user: User) {
    const db_user = await getUser(user);
    const t = getI18n(db_user.locale).t;
    return t;
  }
}