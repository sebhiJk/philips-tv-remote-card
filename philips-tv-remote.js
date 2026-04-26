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

    constructor() {
        super();
    }

    render() {
        const stateObj = this.hass.states[this.config.entity];
        const colorButtons = this.config.color_buttons === "enable";

        const borderWidth = this.config.dimensions && this.config.dimensions.border_width ? this.config.dimensions.border_width : "1px";
        const scale = this.config.dimensions && this.config.dimensions.scale ? this.config.dimensions.scale : 1;
        const remoteWidth = Math.round(scale * 260) + "px";

        const backgroundColor = this.config.colors && this.config.colors.background ? this.config.colors.background : "var( --ha-card-background, var(--card-background-color, white) )";
        const borderColor = this.config.colors && this.config.colors.border ? this.config.colors.border: "var(--primary-text-color)";
        const buttonColor = this.config.colors && this.config.colors.buttons ? this.config.colors.buttons : "var(--secondary-background-color)";
        const textColor = this.config.colors && this.config.colors.texts ? this.config.colors.texts : "var(--primary-text-color)";
        
        return html`
            <div class="card">
            <div class="page" style="--remote-button-color: ${buttonColor}; --remote-text-color: ${textColor}; --remote-color: ${backgroundColor}; --remotewidth: ${remoteWidth};  --main-border-color: ${borderColor}; --main-border-width: ${borderWidth}">
                  ${this.config.name
                  ? html` <span class="title"> ${this.config.name} </span> `
                  : ""}
                  <div class="grid-container-power"  style="--remotewidth: ${remoteWidth}">
                      <button class="btn-flat flat-high ripple" @click=${() => this._channelList()}><ha-icon icon="mdi:format-list-numbered"/></button>
                      ${stateObj.state === 'off' ? html`
                      <button class="btn ripple" @click=${() => this._turn_on()}><ha-icon icon="mdi:power" style="color: ${textColor};"/></button>
                      ` : html`
                      <button class="btn ripple" @click=${() => this._command("PowerOff")}><ha-icon icon="mdi:power" style="color: red;"/></button>
                      `}
                      <button class="btn-flat flat-high ripple" @click=${() => this._command("Back")}><ha-icon icon="mdi:undo-variant"/></button>
                  </div> 
                
<div class="grid-container-cursor">
                  <div class="shape">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 79"><path d="m 30 15 a 10 10 0 0 1 20 0 a 15 15 0 0 0 15 15 a 10 10 0 0 1 0 20 a 15 15 0 0 0 -15 15 a 10 10 0 0 1 -20 0 a 15 15 0 0 0 -15 -15 a 10 10 0 0 1 0 -20 a 15 15 0 0 0 15 -15" fill="var(--remote-button-color)" stroke="#000000" stroke-width="0" /></svg>
                    </div> 
                      <button class="btn ripple item_up" style="background-color: transparent;" @click=${() => this._command("CursorUp")}><ha-icon icon="mdi:chevron-up"/></button>
                      <button class="btn ripple item_input" @click=${() => this._command("Options")}><ha-icon icon="mdi:cog"/></button>
                      
                      <button class="btn ripple item_2_sx" style="background-color: transparent;" @click=${() => this._command("CursorLeft")}><ha-icon icon="mdi:chevron-left"/></button>
                      <button class="btn bnt_ok ripple item_2_c" style="border: solid 2px ${backgroundColor}"  @click=${() => this._command("Confirm")}>OK</button>
                      <button class="btn ripple item_right" style="background-color: transparent;" @click=${() => this._command("CursorRight")}><ha-icon icon="mdi:chevron-right"/></button>
                      
                      <button class="btn ripple item_down" style="background-color: transparent;" @click=${() => this._command("CursorDown")}><ha-icon icon="mdi:chevron-down"/></button>
                      </div>
${colorButtons ? html`
                  <div class="grid-container-color_btn">
                      <button class="btn-color ripple" style="background-color: red; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("RedColour")}></button>
                      <button class="btn-color ripple" style="background-color: green; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("GreenColour")}></button>
                      <button class="btn-color ripple" style="background-color: yellow; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("YellowColour")}></button>
                      <button class="btn-color ripple" style="background-color: blue; height: calc(var(--remotewidth) / 12);" @click=${e => this._command("BlueColour")}></button>
                  </div>
                  ` : html`
                  `}
<div class="grid-container-volume-channel-control" >
                      <button class="btn ripple"  style="border-radius: 50% 50% 0px 0px; margin: 0px auto 0px auto; height: 100%;" @click=${() => this._command("VolumeUp")}><ha-icon icon="mdi:plus"/></button>
                      <button class="btn-flat flat-high ripple" style="margin-top: 0px; height: 50%;" @click=${() => this._command("Home")}><ha-icon icon="mdi:home"></button>
                      <button class="btn ripple" style="border-radius: 50% 50% 0px 0px; margin: 0px auto 0px auto; height: 100%;" @click=${() => this._command("ChannelStepUp")}><ha-icon icon="mdi:chevron-up"/></button>
                      
                      <button class="btn" style="border-radius: 0px; cursor: default; margin: 0px auto 0px auto; height: 100%;"><ha-icon icon="${stateObj.attributes.is_volume_muted === true ? 'mdi:volume-off' : 'mdi:volume-high'}"/></button>
                      <button class="btn ripple" Style="color:${stateObj.attributes.is_volume_muted === true ? 'red' : ''}; height: 100%;"" @click=${() => this._command("Mute")}><span class="${stateObj.attributes.is_volume_muted === true ? 'blink' : ''}"><ha-icon icon="mdi:volume-mute"></span></button>
                      <button class="btn" style="border-radius: 0px; cursor: default; margin: 0px auto 0px auto; height: 100%;"><ha-icon icon="mdi:parking"/></button>
                      
                      <button class="btn ripple" style="border-radius: 0px 0px 50% 50%;  margin: 0px auto 0px auto; height: 100%;" @click=${() => this._command("VolumeDown")}><ha-icon icon="mdi:minus"/></button>
                      <button class="btn-flat flat-high ripple" style="margin-bottom: 0px; height: 50%;" @click=${() => this._command("Source")}><ha-icon icon="mdi:import"/></button>
                      <button class="btn ripple" style="border-radius: 0px 0px 50% 50%;  margin: 0px auto 0px auto; height: 100%;"  @click=${() => this._command("ChannelStepDown")}><ha-icon icon="mdi:chevron-down"/></button>
                  </div>

                  </div>
              </div>
            `;
    }

    _channelList() {
        const popupEvent = new Event('ll-custom', {bubbles: true, cancelable: false, composed: true});
        popupEvent.detail = {
            "browser_mod": {
                "service": "browser_mod.popup",
                "data": {
                    "content": {
                        "type": "custom:card-channel-pad",
                        "entity": this.config.entity,
                        "remote": this.config.remote,
                        "channels": this.config.channels
                    },
                    "title": " ",
                    "size": "wide",
                    "style": "--popup-border-radius: 15px;"
                }
            }
        };
        this.ownerDocument.querySelector("home-assistant").dispatchEvent(popupEvent);
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
        return 15;
    }

    static get styles() {
        return css`
        button:focus { outline:0; }
       .ripple {
           position: relative;
           overflow: hidden;
           transform: translate3d(0, 0, 0);
      }
       .ripple:after {
           content: "";
           display: block;
           position: absolute;
           border-radius: 50%;
           width: 100%;
           height: 100%;
           top: 0;
           left: 0;
           pointer-events: none;
           background-image: radial-gradient(circle, #7a7f87 2%, transparent 10.01%);
           background-repeat: no-repeat;
           background-position: 50%;
           transform: scale(10, 10);
           opacity: 0;
           transition: transform .5s, opacity 1s;
      }
       .ripple:active:after {
           transform: scale(0, 0);
           opacity: .3;
           transition: 0s;
      }
       .blink {
           animation: blinker 1.5s linear infinite;
           color: red;
      }
       @keyframes blinker {
           50% { opacity: 0; }
      }
       .card {
           display: flex;
           justify-content: center;
           width: 100%;
           height: 100%;
      }
       .page {
           background-color: var(--remote-color);
           height: 100%;
           display: inline-block;
           flex-direction: row;
           border: var(--main-border-width) solid var(--main-border-color);
           border-radius: calc(var(--remotewidth) / 7.5);
           padding: calc(var(--remotewidth) / 37.5) calc(var(--remotewidth) / 15.2) calc(var(--remotewidth) / 11) calc(var(--remotewidth) / 15.2);
      }
       .grid-container-power {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
           grid-template-rows: 1fr;
           background-color: transparent;
           overflow: hidden;
           width: var(--remotewidth);
           height: calc(var(--remotewidth) / 3);
      }
       .grid-container-cursor {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
           grid-template-rows: 1fr 1fr 1fr;
           overflow: hidden;
           height: var(--remotewidth);
           width: var(--remotewidth);
           grid-template-areas: "menu up input" "left ok right" "back down exit" 
      }
        .grid-container-color_btn{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: auto;
            background-color: transparent;
            width: calc(var(--remotewidth) / 1.03);
            height: calc(var(--remotewidth) / 10);
            overflow: hidden;
            margin: auto;
        }
        .grid-container-volume-channel-control {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
           grid-template-rows: 1fr 1fr 1fr;
           background-color: transparent;
           width: var(--remotewidth);
           height: calc(var(--remotewidth) / 1.4);
           overflow: hidden;
           margin-top: calc(var(--remotewidth) / 12);
      }
       .shape {
           grid-column-start: 1;
           grid-column-end: 4;
           grid-row-start: 1;
           grid-row-end: 4;
           padding: 5px;
      }
       .item_up { grid-area: up; }
       .item_input { grid-area: input; }
       .item_2_sx{ grid-area: left; }
       .item_2_c { grid-area: ok; }
       .item_right { grid-area: right; }
       .item_down { grid-area: down; }
       
       ha-icon {
           width: calc(var(--remotewidth) / 10.8);
           height: calc(var(--remotewidth) / 10.8); 
      }
       .btn {
           background-color: var(--remote-button-color);
           color: var(--remote-text-color);
           font-size: calc(var(--remotewidth) / 18.75);
           width: 70%;
           height: 70%;
           border-width: 0px;
           border-radius: 50%;
           margin: auto;
           place-items: center;
           display: inline-block;
           cursor: pointer;
      }
        .btn-color {
            background-color: var(--remote-button-color);
            color: var(--remote-text-color);
            width: 70%;
            height: 55%;
            border-width: 0px;
            border-radius: calc(var(--remotewidth) / 10);
            margin: auto;
            place-items: center;
            cursor: pointer;
        }   
       .flat-high {
           width: 70%;
           height: 37%;
      }
       .btn-flat {
           background-color: var(--remote-button-color);
           color: var(--remote-text-color);
           font-size: calc(var(--remotewidth) / 18.75);
           border-width: 0px;
           border-radius: calc(var(--remotewidth) / 10);
           margin: auto;
           display :grid;
           place-items: center;
           display: inline-block;
           cursor: pointer;
      }
       .bnt_ok {
           width: 100%;
           height:100%;
           font-size: calc(var(--remotewidth) / 16.6);
      }
       .title {
          display: block;
          text-align: center;
          font-weight: bold
      }
  `;
    }
}

customElements.define('philips-tv-remote', philipsTvRemote);
