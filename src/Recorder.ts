import { TIntro, TScene } from './types';

class Recorder {
  private intro: TIntro;
  private scenes: TScene[];

  public constructor(intro: TIntro = null, scenes: TScene[] = []) {
    this.intro = intro;
    this.scenes = scenes;
  }

  public getIntro = (): TIntro => this.intro;

  public getScenes = (): TScene[] => this.scenes;

  public setIntro = (intro: TScene): Recorder => {
    this.intro = intro;

    return this;
  }

  public record = (scene: TScene): Recorder => (
    new Recorder(
      this.intro,
      [
        ...this.scenes,
        scene,
      ],
    )
  )

  public replay = (): void => (
    this.scenes.forEach(scene => scene())
  )

  public replayWithIntro = () => {
    this.intro && this.intro();

    this.replay();
  }

  public loadLast = (): TScene => (
    this.scenes.length && this.scenes[this.scenes.length - 1] || (() => {})
  )

  public loadLastWithIntro = (): TScene => () => {
    const lastScene = this.loadLast();

    this.intro && this.intro();
    lastScene && lastScene();
  }

  public duplicate = (): Recorder => (
    new Recorder(this.intro, this.scenes)
  )
}

export default Recorder;
