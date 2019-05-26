import { environment } from '../../../environments/environment';
import { LoggerInterface } from './logger.interface';
import * as color from 'ansicolor';


export enum ConsoleColor {
  DEFAULT = 'default',
  BLACK = 'black',
  GRAY = 'darkGray',
  WHITE = 'white',
  RED = 'red',
  GREEN = 'green',
  YELLOW = 'yellow',
  BLUE = 'blue',
  MAGENTA = 'magenta',
  CYAN = 'cyan',
}

/**
 * Logger Implementation
 */
export class ConsoleLogger implements LoggerInterface {
  private readonly indention = 7;
  private readonly console: Console;
  private readonly name: string;
  private readonly domain: string;

  /**
   * Logger
   * @param domain
   * @param domainColor The color of the domain
   */
  public constructor(domain: string = 'APP', domainColor?: ConsoleColor) {
    if (domain.length > this.indention) {
      throw new Error(`The domain name ${domain} of the logger is too long. The maximum length is ${this.indention} characters, ${domain.length} provided`);
    }

    if (!domainColor) {
      domainColor = ConsoleColor.GREEN;
    }

    this.console = console;
    this.domain = domain;
    this.name = color[domainColor](`[${domain}]`);

    if (environment.production) {
      // TODO create prod console
      this.console = console;
    }
  }

  /**
   * Clear the console
   */
  public clear(): void {
    this.console.clear();
  }

  /**
   * Debug output
   * @param message
   * @param optionalParams
   */
  public debug(message?: any, ...optionalParams: any[]): void {
    this.console.debug(...this.parse(message, optionalParams));
  }

  /**
   * Error Output
   * @param message
   * @param optionalParams
   */
  public error(message?: any, ...optionalParams: any[]): void {
    this.console.error(...this.parse(message, optionalParams));
  }

  /**
   * Exception output
   * @param {string} message
   * @param optionalParams
   */
  public exception(message?: string, ...optionalParams: any[]): void {
    this.console.exception(...this.parse(message, optionalParams));
  }

  /**
   * Info output
   * @param message
   * @param optionalParams
   */
  public info(message?: any, ...optionalParams: any[]): void {
    this.console.info(...this.parse(message, optionalParams));
  }

  /**
   * Log output
   * @param message
   * @param optionalParams
   */
  public log(message?: any, ...optionalParams: any[]): void {
    this.console.log(...this.parse(message, optionalParams));
  }


  /**
   * Table output
   * @param tabularData
   */
  public table(...tabularData: any[]): void {
    this.console.debug(...tabularData);
  }

  /**
   * Warn output
   * @param message
   * @param optionalParams
   */
  public warn(message?: any, ...optionalParams: any[]): void {
    this.console.warn(...this.parse(message, optionalParams));
  }

  /**
   * Parse the string
   * @param message
   * @param optionalParams
   * @return {string[]}
   */
  private parse(message, ...optionalParams: any[]) {
    const surroundingBracketsSpace = 2;
    const emptySpace = (this.indention + surroundingBracketsSpace) - this.domain.length;
    const msg = this.name + ' '.repeat(emptySpace) + message + ' ' + optionalParams.join(' ');
    const parsed = color.parse(msg);
    return parsed.asChromeConsoleLogArguments;
  }
}
