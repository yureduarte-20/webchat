export interface IPublisher {
    subscribe(listener:IEventWrapper):void
    unsubscribe(listener:IListener):void;
    notify(name:string, data?:any):void
}
export interface IListener {
    update(name:string, data?:any):void;
}
export interface IEventWrapper{
    eventNameListener: string;
    listener: IListener;
}