// Copyright (c) 2014-2017, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict"
//
const View = require('../../Views/View.web')
const commonComponents_tables = require('../../MMAppUICommonComponents/tables.web')
const commonComponents_forms = require('../../MMAppUICommonComponents/forms.web')
const commonComponents_navigationBarButtons = require('../../MMAppUICommonComponents/navigationBarButtons.web')
//
class FundsRequestQRDisplayModalView extends View
{
	constructor(options, context)
	{
		super(options, context) // call super before `this`
		//
		const self = this 
		{
			self.initializing__fundsRequest = options.fundsRequest || null
		}
		self.setup()
	}
	setup()
	{
		const self = this
		{
			self.isSubmitButtonDisabled = false
		}
		self.setup_views()
		
	}
	setup_views()
	{
		const self = this
		self._setup_self_layer()
		self._setup_informationalHeaderLayer() // above the validation layer
		self._setup_qrCodeImageLayer()
	}
	_setup_self_layer()
	{
		const self = this
		//
		const layer = self.layer
		layer.style.webkitUserSelect = "none" // disable selection here but enable selectively
		//
		layer.style.position = "relative"
		layer.style.textAlign = "center"
		layer.style.boxSizing = "border-box"
		layer.style.width = "100%"
		layer.style.height = "100%"
		layer.style.padding = "0 0 40px 0" // actually going to change paddingTop in self.viewWillAppear() if navigation controller
		layer.style.overflowY = "auto"
		layer.classList.add( // so that we get autoscroll to form field inputs on mobile platforms
			commonComponents_forms.ClassNameForScrollingAncestorOfScrollToAbleElement()
		)
		// layer.style.webkitOverflowScrolling = "touch"
		//
		layer.style.backgroundColor = "#272527" // so we don't get a strange effect when pushing self on a stack nav view
		layer.style.wordBreak = "break-all" // to get the text to wrap
	}
	_setup_informationalHeaderLayer()
	{
		const self = this
		const layer = document.createElement("div")
		layer.style.width = "calc(100% - 24px - 24px)"
		layer.style.boxSizing = "border-box"
		layer.style.wordBreak = "break-all"
		layer.style.textAlign = "center"
		layer.style.margin = "26px 24px 18px 24px"
		layer.style.paddingBottom = "10px" // for spacing
		layer.style.color = "#9E9C9E"
		layer.style.fontSize = "13px"
		layer.style.fontFamily = self.context.themeController.FontFamily_sansSerif()
		var innerHTML = ""
		{
			let payment_id = self.initializing__fundsRequest.payment_id
			let amount = self.initializing__fundsRequest.amount
			let to_address = self.initializing__fundsRequest.to_address
			var middleTruncatedString = function(fullStr, numFrontChars, numEndChars, separator)
			{
				separator = separator || '...';
				//
				if (fullStr.length <= (numFrontChars.length + numEndChars.length)) {
					return fullStr;
				}
				return fullStr.substr(0, numFrontChars) + 
					separator + 
					fullStr.substr(fullStr.length - numEndChars);
			};
			innerHTML = "Scan this code to send "
			innerHTML += amount ? amount + " XMR" : "Monero"
			if (payment_id != null && payment_id != "" && typeof payment_id !== "undefined") {
				innerHTML += " with payment ID " + middleTruncatedString(payment_id, 10, 6, "…")
			}
			innerHTML += " to " + middleTruncatedString(to_address, 10, 6, "…")
			innerHTML += "."
		}
		layer.innerHTML = innerHTML
		self.informationalHeaderLayer = layer
		self.layer.appendChild(layer)
	}
	_setup_qrCodeImageLayer()
	{
		const self = this
		let imgDataURIString = self.initializing__fundsRequest.qrCode_imgDataURIString
		const layer = commonComponents_tables.New_fieldValue_base64DataImageLayer(
			imgDataURIString, 
			self.context
		)
		layer.style.width = "66%"
		layer.style.height = "auto"
		layer.style.maxWidth = "380px"
		layer.style.display = "inline-block" // margin: '0 auto' didn't work
		layer.style.margin = "0"
		self.layer.appendChild(layer)
	}
	//
	// Runtime - Accessors - Navigation
	Navigation_Title()
	{
		return "Scan Code to Pay"
	}
	Navigation_New_LeftBarButtonView()
	{
		const self = this
		const view = commonComponents_navigationBarButtons.New_LeftSide_CancelButtonView(self.context, "Done")
		self.leftBarButtonView = view
		const layer = view.layer
		layer.addEventListener(
			"click",
			function(e)
			{
				e.preventDefault()
				self.dismissView()
				return false
			}
		)
		return view
	}
	//
	// Imperatives - Modal
	dismissView()
	{
		const self = this
		const modalParentView = self.navigationController.modalParentView
		setTimeout(function()
		{ // just to make sure the PushView is finished
			modalParentView.DismissTopModalView(true)
		})
	}
	//
	// Runtime - Delegation - Navigation/View lifecycle
	viewWillAppear()
	{
		const self = this
		super.viewWillAppear()
		if (typeof self.navigationController !== 'undefined' && self.navigationController !== null) {
			self.layer.style.paddingTop = `${self.navigationController.NavigationBarHeight()}px`
		}
	}
}
module.exports = FundsRequestQRDisplayModalView