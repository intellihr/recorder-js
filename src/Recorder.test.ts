import Recorder from './Recorder';
import { TIntro, TScene } from './types';

describe('Recorder', () => {
  it('should return an instance of Recorder', () => {
    const recorder = new Recorder();

    expect(recorder).toBeInstanceOf(Recorder);
  });

  describe('getIntro', () => {
    const expectedIntro = jest.fn();

    let recorder: Recorder;
    let intro: TIntro;

    beforeEach(() => {
      recorder = new Recorder(expectedIntro);

      intro = recorder.getIntro();
    });

    it('should get the correct intro', () => {
      expect(intro).toEqual(expectedIntro);
    });
  });

  describe('getScenes', () => {
    const expectedScenes = [jest.fn(), jest.fn()];

    let recorder: Recorder;
    let scenes: TScene[];

    beforeEach(() => {
      recorder = new Recorder(null, expectedScenes);

      scenes = recorder.getScenes();
    });

    it('should get the correct intro', () => {
      expect(scenes).toEqual(expectedScenes);
    });
  });

  describe('setIntro', () => {
    const expectedIntro = jest.fn();

    let recorder: Recorder;

    beforeEach(() => {
      recorder = new Recorder();
    });

    it('should set the correct intro', () => {
      expect(recorder.getIntro()).toBeNull();

      recorder.setIntro(expectedIntro);

      expect(recorder.getIntro()).toEqual(expectedIntro);
    });
  });

  describe('record', () => {
    const expectedScene = jest.fn();

    let recorder: Recorder;

    beforeEach(() => {
      recorder = new Recorder();
    });

    it('should record a new scene', () => {
      expect(recorder.getScenes()).toEqual([]);

      const newRecorder = recorder.record(expectedScene);

      expect(newRecorder.getScenes()).toEqual([expectedScene]);
    });
  });

  describe('replay', () => {
    const intro = jest.fn();
    const scenes = [jest.fn(), jest.fn()];

    let recorder: Recorder;

    beforeEach(() => {
      recorder = new Recorder(intro, scenes);

      recorder.replay();
    });

    it('should play all scenes', () => {
      scenes.forEach((scene) => {
        expect(scene).toHaveBeenCalled();
        expect(scene).toHaveBeenCalledTimes(1);
        expect(scene).toHaveBeenCalledWith();
      });
    });

    it('should not play the intro', () => {
      expect(intro).not.toHaveBeenCalled();
    });
  });

  describe('replayWithIntro', () => {
    const intro = jest.fn();
    const scenes = [jest.fn(), jest.fn()];

    let recorder: Recorder;

    beforeEach(() => {
      recorder = new Recorder(intro, scenes);

      recorder.replayWithIntro();
    });

    it('should play all scenes', () => {
      scenes.forEach((scene) => {
        expect(scene).toHaveBeenCalled();
        expect(scene).toHaveBeenCalledTimes(1);
        expect(scene).toHaveBeenCalledWith();
      });
    });

    it('should play the intro', () => {
      expect(intro).toHaveBeenCalled();
      expect(intro).toHaveBeenCalledTimes(1);
      expect(intro).toHaveBeenCalledWith();
    });
  });

  describe('loadLast', () => {
    const intro = jest.fn();
    const scenes = [jest.fn(), jest.fn()];

    let recorder: Recorder;
    let scene: TScene;

    const initializeTest = () => {
      recorder = new Recorder(intro, scenes);

      scene = recorder.loadLast();
      scene();
    };

    beforeEach(initializeTest);

    it('should load the last scene', () => {
      expect(scene).toBe(scenes[1]);

      expect(scenes[1]).toHaveBeenCalled();
      expect(scenes[1]).toHaveBeenCalledTimes(1);
      expect(scenes[1]).toHaveBeenCalledWith();
    });

    it('should not load intro and other scenes', () => {
      expect(intro).not.toHaveBeenCalled();

      expect(scenes[0]).not.toHaveBeenCalled();
    });
  });

  describe('loadLastWithIntro', () => {
    const intro = jest.fn();
    const scenes = [jest.fn(), jest.fn()];

    let recorder: Recorder;
    let scene: TScene;

    const initializeTest = () => {
      recorder = new Recorder(intro, scenes);

      scene = recorder.loadLastWithIntro();
      scene();
    };

    beforeEach(initializeTest);

    it('should load the last scene and the intro', () => {
      expect(intro).toHaveBeenCalled();
      expect(intro).toHaveBeenCalledTimes(1);
      expect(intro).toHaveBeenCalledWith();

      expect(scenes[1]).toHaveBeenCalled();
      expect(scenes[1]).toHaveBeenCalledTimes(1);
      expect(scenes[1]).toHaveBeenCalledWith();
    });

    it('should not load other scenes', () => {
      expect(scenes[0]).not.toHaveBeenCalled();
    });
  });

  describe('duplicate', () => {
    const intro = jest.fn();
    const scenes = [jest.fn(), jest.fn()];

    let recorder: Recorder;
    let newRecorder: Recorder;

    const initializeTest = () => {
      recorder = new Recorder(intro, scenes);

      newRecorder = recorder.duplicate();
    };

    beforeEach(initializeTest);

    it('should create a new Recorder with the same intro and scenes', () => {
      expect(newRecorder).toBeInstanceOf(Recorder);

      expect(newRecorder.getIntro()).toEqual(intro);
      expect(newRecorder.getScenes()).toEqual(scenes);
    });
  });
});
