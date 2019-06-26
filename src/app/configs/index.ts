export type Config = {
  debug?: boolean,
  apiBaseURL?: string
}

export default {
  debug: process.env.REACT_APP_DEBUG,
  apiBaseURL: process.env.REACT_APP_API_BASE_URL,
} as Config;
