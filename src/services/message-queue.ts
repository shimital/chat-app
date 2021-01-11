import { RedisClient } from 'redis';
import redis from 'redis';
import { IMessageQueue, MessageNotificationHandler } from './chat.srv';

class RedisSrv implements IMessageQueue {

    subscriber: RedisClient;
    publisher: RedisClient;

    init (callback: MessageNotificationHandler): void {
        this.initSubscriber();
        this.registerSubscriberEvents(callback);
        this.initPublisher();
    }

    publish (channel: string, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.publisher.publish(channel, message, (err, result) => {
                resolve();
            });
        });
    }

    subscribe (channel: string): void {
        this.subscriber.subscribe(channel);
    }

    private registerSubscriberEvents (callback: MessageNotificationHandler): void {
        this.subscriber.on('subscribe', (channel, count) => {
            console.log(`subscribed to channel: ${ channel }`);
        });

        this.subscriber.on('message', callback);
    }

    private initSubscriber (): void {
        this.subscriber = redis.createClient();
    }

    private initPublisher (): void {
        this.publisher = redis.createClient();
    }

}

export default new RedisSrv();