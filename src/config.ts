import * as config from "config";

interface IConfig {
    homeserverUrl: string;
    pantalaimon: {
        use: boolean;
        username: string;
        password: string;
    }
    accessToken: string;
    autoJoin: boolean;
    dataPath: string;
    language: string;
    permissions: {
        invite: any,
        use: any,
    }
    profile: {
        displayname: string;
        avatar?: boolean;
    }
}

export default <IConfig>config;
