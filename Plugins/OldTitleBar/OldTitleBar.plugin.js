//META{"name":"OldTitleBar"}*//

class OldTitleBar {
	constructor () {
		this.switchFixObserver = new MutationObserver(() => {});
		this.settingsWindowObserver = new MutationObserver(() => {});
		
		this.app = require("electron").remote.getCurrentWindow();
			
		this.dividerMarkup = `<div class="dividerOTB divider-1GKkV3"></div>`;
			
		this.minButtonMarkup = `
			<svg class="minButtonOTB iconInactive-WWHQEI icon-mr9wAc iconMargin-2Js7V9" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
				<g fill="none" class="iconForeground-2c7s3m" fill-rule="evenodd">
					<path fill="currentColor" d="M19 19v-2H7v2h12z"/>
					<path d="M1 25h24V1H1v24z"/>
				</g>
			</svg>`;
			
		this.maxButtonMarkup = `
			<svg class="maxButtonOTB iconInactive-WWHQEI icon-mr9wAc iconMargin-2Js7V9" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
				<g fill="none" class="iconForeground-2c7s3m" fill-rule="evenodd">
					<path d="M1 1h24v24H1V1z"/>
					<path fill="currentColor" d="M8 13H6v7h7v-2H8v-5zm-2 0h2V8h5V6H6v7zm7 5v2h7v-7h-2v5h-5zm0-12v2h5v5h2V6h-7z"/>
				</g>
			</svg>`;
			
		this.closeButtonMarkup = `
			<svg class="closeButtonOTB iconInactive-WWHQEI icon-mr9wAc iconMargin-2Js7V9" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
				<g fill="none" class="iconForeground-2c7s3m" fill-rule="evenodd">
					<path d="M1 1h24v24H1V1z"/>
					<path fill="currentColor" d="M20 7.41L18.59 6 13 11.59 7.41 6 6 7.41 11.59 13 6 18.59 7.41 20 13 14.41 18.59 20 20 18.59 14.41 13 20 7.41z"/>
				</g>
			</svg>`;
	}

	getName () {return "OldTitleBar";}

	getDescription () {return "Reverts the title bar back to its former self.";}

	getVersion () {return "1.0.0";}

	getAuthor () {return "DevilBro";}

    getSettingsPanel () {
		if (typeof BDfunctionsDevilBro === "object") {
			return `
			<label style="color:grey;"><input type="checkbox" onchange='` + this.getName() + `.updateSettings(this, "` + this.getName() + `")' value="forceClose"${(this.getSettings().forceClose ? " checked" : void 0)}> Completely turn off Discord when pressing close.</label>`;
		}
    }

	//legacy
	load () {}

	start () {
		if (typeof BDfunctionsDevilBro === "object") BDfunctionsDevilBro = "";
		$('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]').remove();
		$('head').append("<script src='https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js'></script>");
		if (typeof BDfunctionsDevilBro !== "object") {
			$('head script[src="https://cors-anywhere.herokuapp.com/https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]').remove();
			$('head').append("<script src='https://cors-anywhere.herokuapp.com/https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js'></script>");
		}
		if (typeof BDfunctionsDevilBro === "object") {
			BDfunctionsDevilBro.loadMessage(this.getName(), this.getVersion());
			
			this.settingsWindowObserver = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.removedNodes) {
							change.removedNodes.forEach((node) => {
								if (node && node.tagName && node.getAttribute("layer-id") == "user-settings") {
									this.removeTitleBar();
									this.addTitleBar();
								}
							});
						}
					}
				);
			});
			this.settingsWindowObserver.observe(document.querySelector(".layers"), {childList:true});
			
			this.switchFixObserver = BDfunctionsDevilBro.onSwitchFix(this);
			
			this.addTitleBar();
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}


	stop () {
		if (typeof BDfunctionsDevilBro === "object") {
			this.switchFixObserver.disconnect();
			this.settingsWindowObserver.disconnect();
			
			this.removeTitleBar();
			
			BDfunctionsDevilBro.unloadMessage(this.getName(), this.getVersion());
		}
	}
	
	onSwitch () {
		if (typeof BDfunctionsDevilBro === "object") {
			setTimeout(() => {
				this.addTitleBar();
			},1);
		}
	}

	
	// begin of own functions
	
	getSettings () {
		var defaultSettings = {
			forceClose: false
		};
		var settings = BDfunctionsDevilBro.loadAllData(this.getName(), "settings");
		var saveSettings = false;
		for (var key in defaultSettings) {
			if (settings[key] == null) {
				settings[key] = settings[key] ? settings[key] : defaultSettings[key];
				saveSettings = true;
			}
		}
		if (saveSettings) {
			BDfunctionsDevilBro.saveAllData(settings, this.getName(), "settings");
		}
		return settings;
	}

    static updateSettings (ele, pluginName) {
		var settingspanel = BDfunctionsDevilBro.getSettingsPanelDiv(ele);
		var settings = {};
		var inputs = settingspanel.querySelectorAll("input");
		for (var i = 0; i < inputs.length; i++) {
			settings[inputs[i].value] = inputs[i].checked;
		}
		BDfunctionsDevilBro.saveAllData(settings, pluginName, "settings");
    }
	
	addTitleBar () {
		if ($(".dividerOTB, .minButtonOTB, .maxButtonOTB, .closeButtonOTB").length == 0) {
			$(".iconInactive-WWHQEI").parent()
				.append(this.dividerMarkup)
				.append(this.minButtonMarkup)
				.append(this.maxButtonMarkup)
				.append(this.closeButtonMarkup)
				.on("click." + this.getName(), ".minButtonOTB", () => {
					require("electron").remote.getCurrentWindow().minimize();
				})
				.on("click." + this.getName(), ".maxButtonOTB", () => {
					require("electron").remote.getCurrentWindow().maximize();
				})
				.on("click." + this.getName(), ".closeButtonOTB", () => {
					if (this.getSettings().forceClose) require("electron").remote.app.quit();
					else require("electron").remote.getCurrentWindow().close();
				})
				.parent().css("-webkit-app-region", "drag");
				
			$(".titleBar-3_fDwJ").hide();
		}
	}
	
	removeTitleBar () {
		$(".iconInactive-WWHQEI").parent()
			.off("click." + this.getName())
			.find(".dividerOTB, .minButtonOTB, .maxButtonOTB, .closeButtonOTB").remove();
			
		$(".iconInactive-WWHQEI")
			.parent().parent().css("-webkit-app-region", "initial");
			
		$(".titleBar-3_fDwJ").show();
	}
}