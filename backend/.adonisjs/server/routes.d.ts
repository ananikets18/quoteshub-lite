import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'profile.destroy': { paramsTuple?: []; params?: {} }
    'profile.analytics': { paramsTuple?: []; params?: {} }
    'profile.saved': { paramsTuple?: []; params?: {} }
    'profile.liked': { paramsTuple?: []; params?: {} }
    'profile.onboard': { paramsTuple?: []; params?: {} }
    'profile.logout': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.analytics': { paramsTuple?: []; params?: {} }
    'profile.saved': { paramsTuple?: []; params?: {} }
    'profile.liked': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'profile.analytics': { paramsTuple?: []; params?: {} }
    'profile.saved': { paramsTuple?: []; params?: {} }
    'profile.liked': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'access_tokens.store': { paramsTuple?: []; params?: {} }
    'profile.onboard': { paramsTuple?: []; params?: {} }
    'profile.logout': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'profile.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'profile.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}