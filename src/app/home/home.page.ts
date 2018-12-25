import { Component } from '@angular/core';
import { SmartAudio } from '../services/smartaudio.service';
import { delay } from 'q';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  deviceOrientationHandler: (event: DeviceOrientationEvent) => {};
  displayOrientationHandler: (event: DeviceOrientationEvent) => {};
  deviceOrientationEvent: DeviceOrientationEvent;
  detecting: boolean = false;
  radarWorking: boolean = false;
  playingAlert: boolean = false;
  soundDisabled: boolean = false;
  playingNoDetection: boolean = false;

  constructor(private smartAudio: SmartAudio) {
    this.deviceOrientationHandler = this.onDeviceOrientation.bind(this);
    this.displayOrientationHandler = this.displayOrientation.bind(this);
    window.addEventListener("deviceorientation", this.displayOrientationHandler, true);
  }

  async displayOrientation(event: DeviceOrientationEvent) {
    if ("beta" in event) {
      this.deviceOrientationEvent = event;
    }
  }

  async onDeviceOrientation(event: DeviceOrientationEvent) {
  }

  soundChange() {
    this.soundDisabled = !this.soundDisabled;
  }

  async interact() {
    if (this.detecting)
      return;
    this.detecting = true;
    this.radarWorking = true;
    await this.playRadarSound();
    await this.playRadarSound();
    await this.playRadarSound();
    this.radarWorking = false;
    if (Math.abs(this.deviceOrientationEvent.beta) < 45 || Math.abs(this.deviceOrientationEvent.beta) > 135) {
      this.playingAlert = true;
      if (!this.soundDisabled) {
        await this.smartAudio.play('alert');
      }
      else {
        await delay(2000);
      }
      this.playingAlert = false;
    }
    else {
      this.playingNoDetection = true;
      await delay(2000);
      this.playingNoDetection = false;
    }
    this.detecting = false;
  }

  async playRadarSound(): Promise<any> {
    if (!this.soundDisabled) {
      await this.smartAudio.play('radar');
    }
    else {
      await delay(1000);
    }
  }
}