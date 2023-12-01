import { IEventWrapper, IListener, IPublisher } from "./Publisher";
export const BINDING_KEY = 'core.observers.event-publisher';
export class EventManager implements IPublisher {
    private listeners: IEventWrapper[] = []
    subscribe(listener: IEventWrapper): void {
        if (this.listeners.find(v => v === listener)) return;
        this.listeners.push(listener);
    }
    unsubscribe(listener: IListener): void {
        this.listeners = this.listeners.filter(v => v.listener !== listener)
    }
    notify(name: string ,data?: any): void {
        for(const _listener of this.listeners){
            if(_listener.eventNameListener == name){
                _listener.listener.update(name, data);
            }
        }
    }

}
