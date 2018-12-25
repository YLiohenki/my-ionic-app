import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable()
export class SmartAudio {

    audioType: string = 'html5';
    sounds: any = [];
    alertAudio: any;
    radarAudio: any;

    constructor(platform: Platform) {

        if (platform.is('cordova')) {
            this.audioType = 'native';
        }

        platform.ready().then(() => {
            this.alertAudio = this.preload('alert', 'assets/sound/alarm.mp3');
            this.radarAudio = this.preload('radar', 'assets/sound/radar.mp3');
        });
    }
    preload(key, asset) {
        let audio = {
            key: key,
            asset: asset,
            type: 'html5'
        };
        this.sounds.push(audio);
        return audio;
    }

    play(key) {
        let audio = this.sounds.find((sound) => {
            return sound.key === key;
        });
        let audioAsset = new Audio(audio.asset);
        var result = new Promise((resolve: (value?: any) => void) => { 
            audioAsset.onended = () => {
                resolve();
            };
        })
        audioAsset.play();
        return result;
    }

    stopAlertLoop() {
        this.alertAudio.audio.loop = false;
    }

    startAlertLoop() {
        if (this.alertAudio.audio.loop === false) {
            this.alertAudio.audio.play();
        }
        this.alertAudio.audio.loop = true;
    }
}