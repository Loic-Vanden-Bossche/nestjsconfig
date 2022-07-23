# NestJS-Env-Config

## Getting Started

### Installation

```console
npm install nestjs-env-config --save
```

### API

It's easy to use NestJSConfig APIs to parse, validate and load environment config in NestJS.

The config is divided 3 sections.

* `Config`: The config object that you will find in your NestJS API.
* `DTO`: A class validator DTO to validate config.
* `Default`: Defines all default values here.

config.ts
```typescript
export interface APIConfig extends BaseConfig {
    database: DatabaseConfig;
    ssl: SSLConfig;
    jwt: JWTConfig;
}

export interface JWTConfig {
    secret: string;
    expiresIn: string;
}

export interface SSLConfig {
    enabled: boolean;
    keyPath: string;
    certPath: string;
}

export interface DatabaseConfig {
    host: string;
    port: number | null;
    username: string | null;
    password: string | null;
    name: string | null;
}

export const getConfig = (env: Record<string, unknown>): APIConfig => {
    const config = validateConfig(ConfigEnvironmentDto, defaultConfig, env);

    return {
        port: config.AP_APP_PORT,
        currentEnv: config.AP_APP_ENV,
        verbose: config.AP_APP_VERBOSE,
        whitelistedOrigins: config.AP_APP_URLS_WHITELIST,
        frontendUrl: config.AP_APP_FRONTEND_URL,
        database: {
            host: config.AP_DB_HOST,
            port: config.AP_DB_PORT,
            name: config.AP_DB_NAME,
            username: config.AP_DB_USER,
            password: config.AP_DB_PASSWORD,
        },
        ssl: {
            enabled: config.AP_SSL_ENABLED,
            keyPath: config.AP_SSL_KEY_PATH,
            certPath: config.AP_SSL_CERT_PATH,
        },
        jwt: {
            secret: config.AP_JWT_SECRET,
            expiresIn: config.AP_JWT_EXPIRE_IN,
        },
    };
};
```

config.environment.dto.ts

```typescript
const UseDefault = () => BaseUseDefault(defaultConfig);

export class ConfigEnvironmentDto {
  //Base config
  @ConfigValidators(isPortNumber)
  @Expose()
  @UseDefault()
  @UseEnvPort()
  @TransformNumber()
  @Desc('Port to listen on')
  AP_APP_PORT: number;

  @ConfigValidator(isEnum, Environment)
  @Expose()
  @UseDefault()
  @Desc('Environment to run in')
  AP_APP_ENV: Environment;

  @ConfigValidators(isBoolean)
  @Expose()
  @UseDefault()
  @TransformBoolean()
  @Desc('Enable debug mode')
  AP_APP_VERBOSE: boolean;

  @ConfigValidators(isUrlArray)
  @Expose()
  @TransformArray()
  @UseDefault()
  @Desc('List of urls to proxy')
  AP_APP_URLS_WHITELIST: string[];

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Path of the frontend')
  AP_APP_FRONTEND_URL: string;

  // Database
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Database host')
  @Secret()
  AP_DB_HOST: string;

  @Expose()
  @UseDefault()
  @Desc('Database name')
  AP_DB_NAME: string | null;

  @Expose()
  @UseDefault()
  @Desc('Database user')
  @Secret()
  AP_DB_USER: string | null;

  @Expose()
  @UseDefault()
  @Desc('Database password')
  @Secret()
  AP_DB_PASSWORD: string | null;

  @Expose()
  @UseDefault()
  @TransformNumber()
  @Desc('Database port')
  AP_DB_PORT: number | null;

  // SSL
  @ConfigValidators(isBoolean)
  @Expose()
  @TransformBoolean()
  @UseDefault()
  @Desc('Is database ssl enabled')
  AP_SSL_ENABLED: boolean;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Database ssl key path')
  AP_SSL_KEY_PATH: string;

  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('Database ssl cert path')
  AP_SSL_CERT_PATH: string;

  // JWT
  @ConfigValidators(isString)
  @Expose()
  @UseDefault()
  @Desc('JWT secret')
  @Secret()
  AP_JWT_SECRET: string;

  @ConfigValidators(isValidPeriod, isString)
  @Expose()
  @UseDefault()
  @Desc('JWT expiration time')
  AP_JWT_EXPIRE_IN: string;
}
```

config.default
```typescript
export enum Environment {
  DEV = 'dev',
  STAGING = 'staging',
  PROD = 'prod',
  TEST = 'test',
}

export const defaultConfig: ConfigEnvironmentDto = {
  AP_APP_PORT: 3000,
  AP_APP_ENV: Environment.DEV,
  AP_APP_VERBOSE: false,
  AP_APP_URLS_WHITELIST: ['http://localhost:4200'],
  AP_APP_FRONTEND_URL: 'http://localhost:4200',

  // Database
  AP_DB_HOST: 'localhost',
  AP_DB_NAME: null,
  AP_DB_USER: null,
  AP_DB_PASSWORD: null,
  AP_DB_PORT: null,

  // SSL
  AP_SSL_ENABLED: false,
  AP_SSL_KEY_PATH: '/ssl/cert.key',
  AP_SSL_CERT_PATH: '/ssl/cert.crt',

  // JWT
  AP_JWT_SECRET: 'myverysecretkey',
  AP_JWT_EXPIRE_IN: '1-day',
};
```

Use it in your application `getConfig()`  
In my case I used it in a custom function, but you can use it directly in the config service loader.

```typescript
const loadAPIConfig = async (): Promise<{
  config: APIConfig;
  sslOptions: NestApplicationOptions;
}> => {
  const config = getConfig(process.env);
  return { config, sslOptions: await getSSLOptions(config.ssl) };
};
```

## License

NestJSConfig is licensed under a [MIT License](./LICENSE.md).
