import * as config from "config";

interface IConfig {
    homeserverUrl: string;
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
