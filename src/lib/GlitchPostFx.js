import Phaser from "phaser";

export default class GlitchPostFx extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: "GlitchPostFx",
      fragShader: `
        precision mediump float;

        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;
        uniform float time;
        uniform vec2 resolution;

        float random(vec2 p) {
          return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec2 uv = outTexCoord;
          float glitch = step(0.9, random(vec2(time, uv.y))) * 0.04;
          uv.x += glitch * sin(time * 10.0);
          vec4 color = texture2D(uMainSampler, uv);

          // glitch RGB offset
          vec2 offset = vec2(sin(time * 50.0) * 0.005, 0.0);
          float r = texture2D(uMainSampler, uv + offset).r;
          float g = texture2D(uMainSampler, uv - offset).g;
          float b = texture2D(uMainSampler, uv).b;

          vec4 glitchColor = vec4(r, g, b, 1.0);

          // combinar color original y glitch
          gl_FragColor = mix(color, glitchColor, 0.5 + 0.5 * sin(time * 8.0));
        }
      `,
    });

    this.elapsedTime = 0;
  }

  onPreRender() {
    this.elapsedTime += this.game.loop.delta / 1000;
    this.set1f("time", this.elapsedTime);
    this.set2f("resolution", this.game.config.width, this.game.config.height);
  }
}
