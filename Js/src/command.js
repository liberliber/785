const LineAPI = require('./api');

let exec = require('child_process').exec;

class Command extends LineAPI {

    constructor() {
        super();
        this.spamName = [];
    }

    get payload() {
        if(typeof this.messages !== 'undefined'){
            return (this.messages.text !== null) ? this.messages.text.split(' ').splice(1) : '' ;
        }
        return false;
    }

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });
        return { 
            listMember,
            listPendingInvite
        }
    }
    
    async cancelMember() {
        let gid = this.messages.to;
        let { listPendingInvite } = await this.searchGroup(gid);
        if(listPendingInvite.length > 0){
            this._cancel(gid,listPendingInvite);
        }
    }

    async getSpeed() {
        let curTime = Date.now() / 1000;
        await this._sendMessage(this.messages, 'Read Time');
        const rtime = (Date.now() / 1000) - curTime;
        await this._sendMessage(this.messages, `${rtime} Second`);
        return;
    }

    creator() {
        let msg = {
            text:null,
            contentType: 13,
            contentPreview: null,
            contentMetadata: 
            { mid: 'u236b88bf1eac2b90e848a6198152e647',
            displayName: 'Alfath Dirk' }
        }
        Object.assign(this.messages,msg);
        this._sendMessage(this.messages);
    }
    
    spamGroup() {
        if(this.stateStatus.kick == 1) {
            for (let i = 0; i < 20000; i++) {
                this._createGroup('fuckyou',['ub974ba894f9d31736b2e350de526509b']);
            }
            return;
        } 
    }

    async kickAll() {
        let groupID;
        if(this.stateStatus.kick == 1) {
            let updateGroup = await this._getGroup(this.messages.to);
            updateGroup.name = '黎明的榮光降臨~';
            await this._updateGroup(updateGroup);
            let msg = {
                text:null,
                contentType: 13,
                contentPreview: null,
                contentMetadata: 
                { mid: 'u3a94ee0406b8b8c226b45f910022ebca' }
            }
            Object.assign(this.messages,msg);
            this._sendMessage(this.messages);
            let { listMember } = await this.searchGroup(this.messages.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!this.isAdminOrBot(listMember[i].mid)){
                    this._kickMember(this.messages.to,[listMember[i].mid])
                }
            }
            return;
        } 
        return this._sendMessage(this.messages, ' Kick Failed check status or admin only !');
    }
}

module.exports = Command;
