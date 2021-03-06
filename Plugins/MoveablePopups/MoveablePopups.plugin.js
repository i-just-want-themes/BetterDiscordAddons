//META{"name":"MoveablePopups"}*//

class MoveablePopups {
	constructor () {
	}

	getName () {return "MoveablePopups";}

	getDescription () {return "Adds the feature to move all popups and modals around like on a normal desktop. Ctrl + drag with your left mousebutton to drag element.";}

	getVersion () {return "1.0.5";}

	getAuthor () {return "DevilBro";}

	//legacy
	load () {}

	start () {
		var libraryScript = null;
		if (typeof BDfunctionsDevilBro !== "object" || BDfunctionsDevilBro.isLibraryOutdated()) {
			if (typeof BDfunctionsDevilBro === "object") BDfunctionsDevilBro = "";
			libraryScript = document.querySelector('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]');
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js");
			document.head.appendChild(libraryScript);
		}
		if (typeof BDfunctionsDevilBro === "object") this.initialize();
		else libraryScript.addEventListener("load", () => {this.initialize();});
	}

	initialize () {
		if (typeof BDfunctionsDevilBro === "object") {
			BDfunctionsDevilBro.loadMessage(this);
			
			var observer = null;

			observer = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								if (node && node.classList && node.classList.length > 0 && node.classList.contains("popout")) {
									this.makeMoveable(node);
								}
							});
						}
					}
				);
			});
			BDfunctionsDevilBro.addObserver(this, ".popouts", {name:"popoutObserver",instance:observer}, {childList: true});
			
			observer = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								if (node && node.classList && node.classList.contains("modal-2LIEKY") && !node.querySelector(".downloadLink-wANcd8")) {
									this.makeMoveable(node.querySelector(".inner-1_1f7b"));
								}
								else if (node && node.tagName && node.querySelector(".modal-2LIEKY") && !node.querySelector(".downloadLink-wANcd8")) {
									this.makeMoveable(node.querySelector(".inner-1_1f7b"));
								}
							});
						}
					}
				);
			});
			BDfunctionsDevilBro.addObserver(this, ".app-XZYfmp ~ [class^='theme-']:not([class*='popouts'])", {name:"modalObserver",instance:observer}, {childList: true});
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}


	stop () {
		if (typeof BDfunctionsDevilBro === "object") {
			BDfunctionsDevilBro.unloadMessage(this);
		}
	}

	
	// begin of own functions
	
	makeMoveable (div) {
		$(div)
			.off("mousedown." + this.getName()).off("click." + this.getName())
			.on("click." + this.getName(), (e) => {
				if (this.dragging) {
					e.stopPropagation();
					e.preventDefault();
				}
			})
			.on("mousedown." + this.getName(), (e) => {
				if (e.ctrlKey) {
					this.dragging = true;
					
					if (div.classList.contains("popout")) $(div.firstChild).css("position", "absolute");
					
					var disableTextSelectionCSS = `
						* {
							user-select: none !important;
						}`;
						
					BDfunctionsDevilBro.appendLocalStyle("disableTextSelection", disableTextSelectionCSS);
					var left = $(div).offset().left;
					var top = $(div).offset().top;
					var oldX = e.pageX;
					var oldY = e.pageY;
					$(document)
						.off("mouseup." + this.getName()).off("mousemove." + this.getName())
						.on("mouseup." + this.getName(), () => {
							BDfunctionsDevilBro.removeLocalStyle("disableTextSelection");
							$(document).off("mouseup." + this.getName()).off("mousemove." + this.getName());
							setTimeout(() => {this.dragging = false},1);
						})
						.on("mousemove." + this.getName(), (e2) => {
							var newX = e2.pageX;
							var newY = e2.pageY;
							left = left - (oldX - newX);
							top = top - (oldY - newY);
							oldX = newX;
							oldY = newY;
							$(div).offset({"left":left,"top":top});
						});
				}
			});
	}
}
