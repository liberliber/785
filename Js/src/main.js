const Command = require('./command');
const { Message, OpType, Location, Profile } = require('../curve-thrift/line_types');

class LINE extends Command {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.stateStatus = {
            cancel: 0,
            kick: 1,
        };
        this.messages;
        this.payload
    }

    get myBot() {
        const bot = ['ua10c2ad470b4b6e972954e1140ad1891','u992a6e77041a772b8abd613ea64d4623','u1ec0c2a8e7c72d45237264d8816508e7','u4e2090b88ff63652744cbcd6d44a1522'];
        return bot; 
    }

    isAdminOrBot(param) {
        return this.myBot.includes(param);
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === this.myBot[0]) ? operation.message._from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            this.textMessage(message)
        }

        if(operation.type == 13) { // diinvite
            if(this.stateStatus.kick == 1) {
                return this._acceptGroupInvitation(operation.param1);
            }
        }
        this.getOprationType(operation);
    }

    command(msg, reply) {
        if(this.messages.text !== null) {
            if(this.messages.text === msg.trim()) {
                if(typeof reply === 'function') {
                    reply();
                    return;
                }
                if(Array.isArray(reply)) {
                    reply.map((v) => {
                        this._sendMessage(this.messages, v);
                    })
                    return;
                }
                return this._sendMessage(this.messages, reply);
            }
        }
    }

    async textMessage(messages) {
        this.messages = messages;
        let payload = (this.messages.text !== null) ? this.messages.text.split(' ').splice(1).join(' ') : '' ;
        let receiver = messages.to;
        let sender = messages.from;
        
        this.command('.speed', this.getSpeed.bind(this));
        this.command(`.kickall ${payload}`,this.kickAll.bind(this));
        this.command('.cancelall', this.cancelMember.bind(this));
        this.command('.spam',this.spamGroup.bind(this));
//        this.command(`.spam ${payload}`,this.spamGroup.bind(this));
        this.command(`.creator`,this.creator.bind(this));
    }

}


module.exports = LINE;
