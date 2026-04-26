var LitElement = LitElement || Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
var html = LitElement.prototype.html;
var css = LitElement.prototype.css;

class philipsTvRemote extends LitElement {
    static get properties() {
        return {
            hass: {},
            config: {}
        };
    }

    render() {
        const stateObj = this.hass.states[this.config.entity];
        const colorButtons = this.config.color_buttons === "enable";

        const scale = this.config.dimensions && this.config.dimensions.scale ? this.config.dimensions.scale : 1;
        const remoteWidth = Math.round(scale * 300) + "px";

        const backgroundColor = this.config.colors && this.config.colors.background ? this.config.colors.background : "var( --ha-card-background, var(--card-background-color, white) )";
        const buttonColor = this.config.colors && this.config.colors.buttons ? this.config.colors.buttons : "var(--secondary-background-color)";
        const textColor = this.config.colors && this.config.colors.texts ? this.config.colors.texts : "var(--primary-text-color)";
        
        return html`
            <div class="card">
            <div class="page" style="--remote-button-color: ${buttonColor}; --remote-text-color: ${textColor}; --remote-color: ${backgroundColor}; --remotewidth: ${remoteWidth};">
                  ${this.config.name
                  ? html` <span class="title"> ${this.config.name} </span> `
                  : ""}
                
                  <div class="grid-container-cursor">
                      <div class="shape">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 79"><path d="m 30 15 a 10 10 0 0 1 20 0 a 15 15 0 0 0 15 15 a 10 10 0 0 1 0 20 a 15 15 0 0 0 -15 15 a 10 10 0 0 1 -20 0 a 15 15 0 0 0 -15 -15 a 10 10 0 0 1 0 -20 a 15 15 0 0 0 15 -15" fill="var(--remote-button-color)" /></svg>
                      </div> 
                      
                      <button class="btn ripple item_vol_up" @click=${() => this._command("VolumeUp")}><ha-icon icon="mdi:plus"/></button>
                      <button class="btn ripple item_vol_mute" style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''};" @click=${() => this._command("Mute")}><span class="${stateObj.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="${stateObj.attributes.is_volume_muted === true ? 'mdi:volume-off' : 'mdi:volume-mute'}"></span></button>
                      <button class="btn ripple item_vol_down" @click=${() => this._command("VolumeDown")}><ha-icon icon="mdi:minus"/></button>

                      <button class="btn ripple item_source" @click=${() => this._command("Source")}><ha-icon icon="mdi:import"/></button>
                      <button class="btn ripple item_power" @click=${() => stateObj.state === 'off' ? this._turn_on() : this._command("PowerOff")}>
                          <ha-icon icon="mdi:power" style="color: red;"/>
                      </button>
                      <button class="btn ripple item_options" @click=${() => this._command("Options")}><ha-icon icon="mdi:format-list-numbered"/></button>
                      <button class="btn ripple item_back" @click=${() => this._command("Back")}><ha-icon icon="mdi:undo-variant"/></button>

                      <button class="btn ripple item_up" style="background-color: transparent; color: turquoise;" @click=${() => this._command("CursorUp")}><ha-icon icon="mdi:chevron-up"/></button>
                      <button class="btn ripple item_left" style="background-color: transparent; color: turquoise;" @click=${() => this._command("CursorLeft")}><ha-icon icon="mdi:chevron-left"/></button>
                      <button class="btn bnt_ok ripple item_ok" style="background-color: transparent; color: turquoise;" @click=${() => this._command("Confirm")}>OK</button>
                      <button class="btn ripple item_right" style="background-color: transparent; color: turquoise;" @click=${() => this._command("CursorRight")}><ha-icon icon="mdi:chevron-right"/></button>
                      <button class="btn ripple item_down" style="background-color: transparent; color: turquoise;" @click=${() => this._command("CursorDown")}><ha-icon icon="mdi:chevron-down"/></button>

                      <button class="btn ripple item_ch_up" @click=${() => this._command("ChannelStepUp")}><ha-icon icon="mdi:chevron-up"/></button>
                      <button class="btn item_ch_lbl" style="cursor: default;">P</button>
                      <button class="btn ripple item_ch_down" @click=${() => this._command("ChannelStepDown")}><ha-icon icon="mdi:chevron-down"/></button>
                  
                      <div class="vol-bg"></div>
                      <div class="ch-bg"></div>
                  </div>

                  <div class="grid-container-home">
                      <button class="btn ripple item_home" style="width: calc(var(--remotewidth)/5.5); height: calc(var(--remotewidth)/5.5); border: 2px solid lightgray; border-radius: 50%;" @click=${() => this._command("Home")}>
                          <ha-icon icon="mdi:home"></ha-icon>
                      </button>
                  </div>

                ${colorButtons ? html`
                  <div class="grid-container-color_btn">
                      <button class="btn-color ripple" style="background-color: red; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("RedColour")}></button>
                      <button class="btn-color ripple" style="background-color: green; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("GreenColour")}></button>
                      <button class="btn-color ripple" style="background-color: yellow; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("YellowColour")}></button>
                      <button class="btn-color ripple" style="background-color: blue; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("BlueColour")}></button>
                  </div>
                  ` : ""}
              </div>
            </div>
        `;
    }

    _command(command) {
        this.hass.callService("remote", "send_command", {
            entity_id: this.config.remote,
            command: command
        });
    }
    
    _turn_on() {
        this.hass.callService("remote", "turn_on", {
            entity_id: this.config.remote
        });
    }

    setConfig(config) {
        if (!config.entity || !config.remote) {
            throw new Error("Invalid configuration");
        }
        this.config = config;
    }

    getCardSize() {
        return 10;
    }

    static get styles() {
        return css`
        button:focus { outline:0; }
       .ripple {
           position: relative; overflow: hidden; transform: translate3d(0, 0, 0);
      }
       .ripple:after {
           content: ""; display: block; position: absolute; border-radius: 50%; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none;
           background-image: radial-gradient(circle, #7a7f87 2%, transparent 10.01%); background-repeat: no-repeat; background-position: 50%;
           transform: scale(10, 10); opacity: 0; transition: transform .5s, opacity 1s;
      }
       .ripple:active:after { transform: scale(0, 0); opacity: .3; transition: 0s; }
       .blink { animation: blinker 1.5s linear infinite; color: red; }
       @keyframes blinker { 50% { opacity: 0; } }
       
       .card { display: flex; justify-content: center; width: 100%; height: 100%; }
       .page {
           background-color: var(--remote-color); height: 100%; display: inline-block;
           /* ÄUSSERER RAHMEN ENTFERNT */
           border: 0; 
           border-radius: calc(var(--remotewidth) / 7.5);
           padding: calc(var(--remotewidth) / 37.5) calc(var(--remotewidth) / 15.2) calc(var(--remotewidth) / 25) calc(var(--remotewidth) / 15.2);
      }
      
       .grid-container-cursor {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
           grid-template-rows: 1fr 1fr 1fr;
           width: var(--remotewidth);
           height: calc(var(--remotewidth) * 0.55);
           margin: auto;
           position: relative;
           grid-template-areas: 
            "vol_up   source   up   power   ch_up"
            "vol_mute left     ok   right   ch_lbl"
            "vol_down options  down back    ch_down";
      }
      
       .shape { 
           grid-column: 2 / 5; grid-row: 1 / 4; 
           display: flex; align-items: center; justify-content: center; 
       }
       .shape svg { 
           width: 95%; 
           height: auto;
           max-height: 85%;
       }
       
       .vol-bg { grid-row: 1 / 4; grid-column: 1; border: 2px solid lightgray; border-radius: 50px; width: 85%; height: 95%; align-self: center; justify-self: center; pointer-events: none; z-index: 2; box-sizing: border-box; }
       .ch-bg { grid-row: 1 / 4; grid-column: 5; border: 2px solid lightgray; border-radius: 50px; width: 85%; height: 95%; align-self: center; justify-self: center; pointer-events: none; z-index: 2; box-sizing: border-box; }
       
       .item_vol_up { grid-area: vol_up; border-radius: 50px 50px 0 0; width: 75%; height: 100%; margin: 0 auto; }
       .item_vol_mute { grid-area: vol_mute; border-radius: 0; width: 75%; height: 100%; margin: 0 auto; }
       .item_vol_down { grid-area: vol_down; border-radius: 0 0 50px 50px; width: 75%; height: 100%; margin: 0 auto; }
       
       .item_ch_up { grid-area: ch_up; border-radius: 50px 50px 0 0; width: 75%; height: 100%; margin: 0 auto; }
       .item_ch_lbl { grid-area: ch_lbl; border-radius: 0; width: 75%; height: 100%; margin: 0 auto; font-weight: bold; font-size: calc(var(--remotewidth) / 15); }
       .item_ch_down { grid-area: ch_down; border-radius: 0 0 50px 50px; width: 75%; height: 100%; margin: 0 auto; }

       .btn {
           background-color: var(--remote-button-color); color: var(--remote-text-color);
           width: 75%; height: 75%;
           border: 0; border-radius: 50%; margin: auto; cursor: pointer;
           display: flex; justify-content: center; align-items: center;
           box-sizing: border-box;
      }

       .btn.item_source { grid-area: source; border: 2px solid lightgray; }
       .btn.item_power { grid-area: power; border: 2px solid lightgray; }
       .btn.item_options { grid-area: options; border: 2px solid lightgray; }
       .btn.item_back { grid-area: back; border: 2px solid lightgray; }

       .item_up { grid-area: up; }
       .item_left { grid-area: left; }
       .item_ok { grid-area: ok; }
       .item_right { grid-area: right; }
       .item_down { grid-area: down; }

       .grid-container-home {
           display: flex; justify-content: center; margin-top: calc(var(--remotewidth) / 12);
       }

        .grid-container-color_btn{
            display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
            width: calc(var(--remotewidth) / 1.03); height: calc(var(--remotewidth) / 10); margin: 15px auto 5px auto;
        }
        
       ha-icon { width: calc(var(--remotewidth) / 11); height: calc(var(--remotewidth) / 11); }
       
       .bnt_ok { width: 95%; height: 95%; font-size: calc(var(--remotewidth) / 16.6); }
       .title { display: block; text-align: center; font-weight: bold; padding-bottom: 5px; }
       .btn-color { border-radius: calc(var(--remotewidth) / 10); border: 0; width: 70%; margin: auto; cursor: pointer; }
  `;
    }
}

customElements.define('philips-tv-remote', philipsTvRemote);
