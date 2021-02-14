import * as config from "config";

interface IConfig {
    homeserverUrl: string;
    accessToken: string;
    autoJoin: boolean;
    dataPath: string;
    country: string;
    profile: {
        displayname: string;
        avatar?: boolean;
    }
}

export default <IConfig>config;
