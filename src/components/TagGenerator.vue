<template>
  <transition name="fade">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <transition-group name="modal-transition" tag="div">
          <!--General Ad Tag Settings-->
          <div class="g-modal-container g-modal-wide" v-bind:class="{ gmodalleft: dspsett || invsett }" v-bind:key="1" v-if="showGenerator">
            <!-- <button class="closebtn" @click="closeGenerator"> &times;</button> -->
            <div class="g-modal-title" style="color:#5CB85C;">Ad Tag Generator</div>
            <div class="g-modal-content">
              <div id="general-setting">
               <!--  Generate Ad Tag for Campaign
                <br> -->
                <select id="campaign-select" v-model="campaignId">
                  <option v-for="campaign in campaignlist" v-bind:value="campaign.id" >
                    {{ campaign.name }}
                  </option>
                </select>
                <!-- <br> -->
                Which DSP is this Ad Tag for?
                <br>
                <div style="position: relative;">
                <select id="dsp-select" v-model="dspName">
                  <optgroup label="Custom DSP">
                    <option v-for="(dsp, index) in customDSP" v-bind:value="index">
                      {{dsp.name}}
                    </option>
                  </optgroup>
                  <optgroup label="Predefined DSP">
                    <option v-for="(dsp, index) in definedDSP" v-bind:value="index">
                    {{ dsp.name }}
                    </option>
                  </optgroup>
                </select>
                <div id="edit-dsp">
                  <button class="link-button" v-bind:disabled="disableedit" v-if="!disableedit" @click="showDSPsett">Edit</button>
                  <div id="edit-dsp-tooltip" class="g-modal-tooltip">You can only edit your own Custom DSP</div>
                </div>
                <button id="advance-settings" class="link-button" @click="toggleInvsett">{{InvSettText}}</button>
                </div>
                <div v-if="timezone != '+09:00' && !isVast">
                  <input type="checkbox" name="inApp-check" value="true" id="inApp-check" v-model="isInApp"/>
                  <label for="inApp-check">In-App (MRAID)</label> <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" style="vertical-align: -3px;" rel="In-App (MRAID)"
               rel2=" Select this if you want to run the ad tag in In-App environment." alt="">
                </div>
              </div>
              <hr class="greenline">
              <div id="ad-tag-section" style="position: relative;">
                <span class="g-modal-sub-title">Ad Tag</span>
                <a :href="testerLink" id="tester-link" class="link-button"
                   target="_blank">
                  Test Your Ad Tag Here
                </a>
                <br>
                <div id="vastVer" v-if="isVast">
                  Vast Format
                  <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" style="vertical-align: -3px;" rel="Vast Format"
               rel2=" VAST tag comes in 2 formats such as a VAST URL or VAST XML codes. Choose the correct format that is supported by your DSP. If your DSP support both formats, using VAST XML format is preferable." alt="">
                  <input type="radio" name="vastFor" value="xml" id="vastf-xml" v-model="vastFormat" />
                  <label for="vastf-xml">XML</label>
                  <input type="radio" name="vastFor" value="url" id="vastf-url" v-model="vastFormat" />
                  <label for="vastf-url" style="margin-right: 75px;">URL</label>
                  Vast Version
                  <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" style="vertical-align: -3px;" rel="Vast Version"
               rel2="Different DSP may support different VAST version. Selecting the correct VAST version ensure optimum delivery of your ad. If unsure, choose VAST 2.0 which is the widely supported VAST version." alt="">
                  <input type="radio" name="vastVer" value="2.0" id="vast2" v-model="vastVersion" />
                  <label for="vast2">2.0</label>
                  <input type="radio" name="vastVer" value="3.0" id="vast3" v-model="vastVersion" />
                  <label for="vast3" style="margin-right: 30px;">3.0</label>
                </div>
                <textarea id="ad-tag-text" onclick="this.select();" v-bind:class="{ 'isVast': isVast, 'inAppOpt': timezone != '+09:00' && !isVast }" readonly>Your Script here</textarea>
                <div id="ad-tag-tooltip" class="g-modal-tooltip" v-if="showAdtagmsg">
                  <i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw" style="color:white; line-height: 30px;" v-if="adTagspinner"></i>
                  <br v-if="adTagspinner">
                  {{adTagmsg}}
                </div>
              </div>
              <!-- <div class="instruction">
                Next, copy this ad tag and set it up as a Third Party Ad Tag in your DSP. You can then set up the targeting (location, language, etc) in the DSP and go live with your campaign.
                <button class="link-button" style="margin-left: 0px; display: block; margin-top: 5px; text-align: left;padding-left: 0px;" @click="openChatbot">Not sure what is a DSP or how it works with our Ad Tag? Click here to learn more</button>
              </div> -->
              <div class="modal-footer-btn">
                <!-- <button class="modal-btn" @click="closeGenerator">Close</button> -->
                <button class="modal-btn main" id="copy-ad-tag-btn" data-clipboard-target="#ad-tag-text">Copy Ad Tag</button>
              </div>
            </div>
          </div>

          <!--DSP Settings-->
          <div class="g-modal-container gmodalright" v-if="dspsett" v-bind:key="2">
            <div class="g-modal-title">DSP Settings</div>
            <div class="g-modal-content">
              DSP Name
              <br>
              <input type="text" id="dsp-name-input" v-model="dspNameinput"/>
              Click Macro
              <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png"  class="help-icon tooltipsIcon" rel="Click Macro"  rel2="Click Macro is used by your DSP/Ad Exchange to track clickthroughs on the ad.</br> There are typically 3 types of macros offered by most DSP/Ad Exchange: Non Escaped, Single Escaped and Double Escaped Macro.</br>Non Escaped Macro is a tracking url in its simplest form without any encoding.</br>Single Escaped Macro is a tracking url that has been encoded one time.</br>Double Escaped Macro is a tracking url that has been encoded two times.</br>Check with your DSP/Ad Exchange what is their supported macro." alt="">
              <br>
              <input type="text" placeholder="[clickmacro]" id="cm-input" style="margin-left: 15px; margin-bottom: 10px;" v-model="cm"/>
              <input type="checkbox" name="clickmacro-check" value="true" id="nonrediectmacro" v-model="nondirmac"/>
              <label for="nonrediectmacro">Non-redirect Macro</label>
              <br>
              <input type="radio" name="clickmacro" value="ct" id="nonescape" v-model="escMacro" v-bind:disabled="nondirmac" />
              <label for="nonescape">Non Escaped/Single Escaped</label>
              <input type="radio" name="clickmacro" value="ect" id="dbescape" v-model="escMacro" v-bind:disabled="nondirmac"/>
              <label for="dbescape">Double Escaped</label>
              <hr class="greenline">
              <div class="dsp-sett">
                Cachbuster Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png"  class="help-icon tooltipsIcon" rel="Cachebuster Macro"  rel2="Cachebuster is to ensure the ad is not cached in the user's browser and affect the tracking of impression and engagement. </br>You can get the Cachebuster Macro from your DSP/Ad Exchange." alt="">
                <input type="text" placeholder="[cachbuster]" id="cachebuster-input" v-model="cb"/>
                Exchange Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png"  class="help-icon tooltipsIcon" rel="Exchange Macro"  rel2="Exchange Macro is a macro which sends us information of the <b>Ad Exchange/Ad Networks</b> your ad is served into. <br>We will  be able to give you performance breakdown report based on these so you can get insights of which exchanges/networks give you better performance." alt="">
                <input type="text" placeholder="[exchange]" id="exchange-input" v-model="exchMac"/>
                Inventory Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png"  class="help-icon tooltipsIcon" rel="Inventory Macro"  rel2="Inventory Macro is a macro which sends us information of the <b>Websites/Apps</b> your ad is served into. <br> We will able to give you performance breakdown report based on these so you can get insights of which websites/apps give you better performance." alt="">
                <input type="text" placeholder="[site]" id="invntory-input" v-model="invMac"/>
                Device ID Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png"  class="help-icon tooltipsIcon" rel="Device ID Macro"  rel2="Device ID macro is a macro which sends us information of the unique identifier of the <b>Device</b> your ad is served into. <br>This will allow you to capture a list of the unique identifier and use it for retargeting campaign." alt="">
                <input type="text" placeholder="[deviceid]" id="deviceid-input" v-model="devidMac"/>
                Interstitial Impression Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Impression Macro"
                rel2="Impression macro tracks the impression of your ad.</br> The macro is triggered when the ad is fetched and loaded." alt="">
                <input type="text"" placeholder="[impression]" id="imp-input" v-model="impMac" />
               <!--  <div v-if="!isVast">
                First Engagement Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"
                 rel="First Engagement Macro" rel2="First Engagement macro tracks the first interaction on an ad. The tracker will only be triggered on the first interaction within the ad."
                 alt="">
                <input type="text" placeholder="[engagement]" id="fet-input" v-model="fetMac" />
                <br>
                </div>
                Clickthrough Macro (Optional)
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Clickthrough Macro"
                rel2="Clickthrough macro tracks clicks.</br> The macro is triggered when clickthroughs happen. " alt="">
                <input type="text" placeholder="[clickthrough]" id="ct-input" v-model="cteMac" />
                <br> -->
              </div>
              <div class="modal-footer-btn">
                <button class="modal-btn" @click="closeDSPsett()">Close</button>
                <button class="modal-btn danger" @click="deleteDSP=true" v-if="deleteBtn">Delete DSP</button>
                <button class="modal-btn main" id="save-dsp-btn" @click="saveAndupdate()">Save Custom DSP</button>
              </div>
            </div>
          </div>

          <!--Inventory Setting-->
          <div class="g-modal-container gmodalright" v-if="invsett" v-bind:key="3">
            <div class="g-modal-title">Inventory Settings</div>
            <div class="g-modal-content">
              <input type="checkbox" name="invcheck" value="true" id="https-checkbox" v-model="secure"/>
              <label for="https-checkbox">Enable Secure Serving (HTTPS)</label>
              <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Secure Serving (HTTPS)"
               rel2="By default, your ad tag will be served on normal websites (HTTP).</br> To serve your ad on secured websites (HTTPS), you need to enable secure serving. If you are unsure, please check with your DSP/Ad Exchange." alt="">
              <br>
              <!--VAST ONLY -->
              <div v-if="isVast">
              <input type="checkbox" name="invcheck" value="true" id="skipvid-checkbox" v-model="skv"/>
              <label for="skipvid-checkbox">Allow video skipping after &nbsp;</label>
              <input type="number" name="invcheck" value="5" min="5" max="15" id="vid-timer" v-model="vidtime" v-bind:disabled="!skv"> seconds
              <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"
                rel="Skip Video Timer" rel2="Enable this to allow replace the close button with a timer. The timer will run for the specified duration and when the timer runs out, the close button will display. This will ensure the user sees the ad for the specified duration before they can close the ad."
                alt="">
              </div>
              <!--VAST ONLY END-->

              <!--NON VAST ONLY-->
              <div v-if="!isVast">
                <input type="checkbox" name="invcheck" value="true" id="polite-checkbox" v-model="polite"/>
                <label for="polite-checkbox">Enable Polite Load</label>
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"
                  rel="Polite Load" rel2="Polite load is an ad serving process where it delays the loading of your full ad before the publisher's website finish loading.<br/><br/>Polite load is a must for some publishers and ad networks (i.e Google).<br/>You will need to enable this or your campaign will be rejected."
                  alt="">
                <br>
                <input type="checkbox" name="invcheck" value="true" id="tmc-checkbox" v-bind:disabled="disabletmc" v-model="tmc"/>
                <label for="tmc-checkbox">Tune Marketing Console(Supported Platform Only)</label>
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"    rel="Tune Marketing Console (Supported Platform Only)"   rel2="Tune Marketing Console (Supported Platform Only) supports the measurement and attribution of Ads. Integration with TMC will provides additional insights into how the Ads impact your user's engagement and acquisition."   alt="">
                <br>
                <input type="checkbox" name="invcheck" value="true" id="cbt-checkbox" v-bind:disabled="disablecbt" v-model="cbt"/>
                <label for="cbt-checkbox">Enable Close Button Timer for &nbsp;</label>
                <input type="number" name="invcheck" value="5" min="5" max="30" id="cbt-timer" v-bind:disabled="disablecbt" v-model="cbttime"> seconds
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"
                  rel="Close Button Timer" rel2="Enable this to replace the close button with a timer. The timer will run for the specified duration and when the timer runs out, the close button will display. This will ensure the user sees the ad for the specified duration before they can close the ad."
                  alt="">
                <br>
                <input type="checkbox" name="invcheck" value="true" id="ifr-view-checkbox" v-model="ifrview" />
                <label for="ifr-view-checkbox">Iframe Viewability</label>
                <div style="display: none;"><!--  v-if="timezone == '+09:00'" --> <!-- no longer in use -->
                  <input type="checkbox" name="forceStatic" value="false" id="forceStatic" v-model="forceStatic" />
                  <label for="forceStatic">Run As Static Banner</label>
                </div>
              </div>

              <!--NON VAST ONLY END-->

              <hr class="greenline">
              <span class="g-modal-title">External Tracker Settings</span>

              <div class="ext-sett" v-bind:class="{ 'isVast': isVast }">
                Impression Tracker
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Impression Tracker"
                rel2="Impression Tracker tracks the impression of your ad.</br> The tracker is triggered when the ad is fetched and loaded." alt="">
                <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="imp-input" v-model="trackImp"></textarea>
                <br>
                <div v-if="!isVast">
                First Engagement Tracker
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"
                 rel="First Engagement Tracker" rel2="First Engagement Tracker tracks the first interaction on an ad. The tracker will only be triggered on the first interaction within the ad."
                 alt="">
                <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="fet-input" v-model="fet"></textarea>
                <br>
                </div>
                Clickthrough Tracker
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Clickthrough Tracker"
                rel2="Clickthrough Tracker tracks clicks.</br> The tracker is triggered when clickthroughs happen. " alt="">
                <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="ct-input" v-model="cte"></textarea>
                <br>

                <!--Video Play Tracker
                <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Video Play Tracker"
                rel2="Video Play Tracker is triggered when video ads start to play." alt="">
                <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="vp-input"></textarea>
                <br>-->

                <!--<button @click="moretrackers = !moretrackers" class="link-button" v-if="!moretrackers">
                  Show More Trackers
                </button>-->
                <!--More Trackers-->
                  <!--<div v-if="moretrackers" style="transition: opacity .3s ease;">-->
                  <div style="transition: opacity .3s ease;" v-if="!isVast">
                    Click-to-Expand Tracker (Expandable Ad Only)
                    <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon"
                    rel="Click-to-Expand Tracker" rel2="Click-to-Expand Tracker tracks the number of clicks on an expandable ad where it expands.</br> The tracker will be triggered when the expandable ad is clicked."
                    alt="">
                    <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="cte-input" v-model="trackExp"></textarea>
                    <br>
                    Tab Click Tracker
                    <img src="http://d2wq251ql2e9x9.cloudfront.net/images/generate-ad-tag/help.png" class="help-icon tooltipsIcon" rel="Tab Click Tracker" rel2="Tab Click Tracker tracks the number of clicks on tabs within the ad.</br> The tracker will be triggered when the user clicks on any tabs within the ad."
                    alt="">
                    <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="tc-input" v-model="tc"></textarea>
                    <br>
                    <!--Video First Quartile Tracker
                    <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="v1-input"></textarea>
                    <br>
                    Video Midpoint Tracker
                    <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="v2-input"></textarea>
                    <br>
                    Video Third Quartile Tracker
                    <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="v3-input"></textarea>
                    <br>
                    Video Completion Tracker
                    <textarea class="ext-track" placeholder="http://track.com?xxx http://abc.com?yyy" id="v4-input"></textarea>
                    <br>
                    <button @click="moretrackers = !moretrackers" class="link-button" id="hidetrackers">
                    Hide More Trackers
                    </button>-->
                  </div>
              </div>

              <!--<hr class="greenline" v-if="isVast">
              <span class="g-modal-title" v-if="isVast">Vast Settings</span>
              <div class="vast-sett"  v-if="isVast">
                Vast Version:
                <br>
                <input type="radio" name="vastVer" value="2.0" id="vast2" v-model="vastVersion" />
                <label for="vast2">2.0</label>
                <input type="radio" name="vastVer" value="3.0" id="vast3" v-model="vastVersion" />
                <label for="vast3">3.0</label>
              </div>-->

              <div class="modal-footer-btn">
                <button class="modal-btn" @click="toggleInvsett()">Close</button>
                <button class="modal-btn main" id="update-tag-btn" @click="saveAndupdate()">Update Ad Tag</button>
              </div>

            </div>
          </div>

          <!--No Active Ads-->
          <div class="g-modal-container g-modal-wide g-modal-msg" v-if="activateAd" v-bind:key="4">
            <button class="closebtn" @click="closeGenerator"> &times;</button>
            <div class="g-modal-title text-red">
              There is no Active Ad in this Campaign.
            </div>
            <div class="g-modal-content">
              <br>
              You need at least ONE Active Ad to run your Campaign.
              <br><br>
              <a id="activateAdurl" v-bind:href="activateAdurl" v-if="adUrlline">Click here to activate your Ad(s)</a>
            </div>
          </div>
        </transition-group>

        <transition name="fade">
          <!--Verifying Campaign-->
          <div class="g-modal-container g-modal-wide g-modal-msg g-modal-absolute" v-if="verifying">
            <button class="closebtn" @click="closeGenerator"> &times;</button>
            <div class="g-modal-sub-title">
              <img src="http://d2wq251ql2e9x9.cloudfront.net/images/loader.gif" width="30"/>
              <br><br>
                Verifying Campaign...
            </div>
          </div>
        </transition>

        <transition name="fade">
          <!--Error in Verifying-->
           <div class="g-modal-container g-modal-wide g-modal-msg g-modal-absolute" v-if="showError">
            <button class="closebtn" @click="closeGenerator"> &times;</button>
            <div class="g-modal-sub-title text-red">
              An Error has occurred...
              <br>Please try Again...
            </div>
          </div>
        </transition>


        <!--Delete DSP -->
        <transition name="fade">
        <div class="modal-mask" v-if="deleteDSP">
          <div class="g-modal-container g-modal-wide g-modal-msg g-modal-absolute" >
            <button class="closebtn" @click="deleteDSP=false"> &times;</button>
            <div class="g-modal-sub-title">
              Delete <span style="color:#E6695B">'{{dspName}}'</span> ?
              <br><br>
              <button class="modal-btn" @click="deleteDSP=false">Cancel</button>
              <button class="modal-btn danger" @click="deleteDSPforSure()">Yes</button>
            </div>
          </div>
        </div>
        </transition>

        <!-- MsgBox-->
        <transition name="fade">
        <div class="g-modal-container g-modal-msg g-modal-absolute" v-if="pend">
          <img src="http://d2wq251ql2e9x9.cloudfront.net/images/loader.gif" width="30" v-if="spinner"/>
          <br v-if="spinner">
          <div class="g-modal-sub-title">
            <i class="fa fa-check" style="color:#5CB85C" v-if="msgSign==1"></i>
            <i class="fa fa-times" style="color:#E6695B" v-if="msgSign==2"></i>
            <i class="fa fa-exclamation" v-if="msgSign==3"></i>
            &nbsp;&nbsp;{{pendMsg}}
          </div>
        </div>
        </transition>

      </div>
    </div>
  </transition>
</template>

<script type="text/javascript">
  /* eslint-disable */
//  import jQuery from 'jQuery';
  import axios from 'axios';
  import clipboard from 'clipboard';

  export default {
    name: 'modal',
    data() {
      return this.resetdata()
    },
    methods: {
      resetdata: function() {
        return{
          // showModal: false, //Hide/Show Modal
          showGenerator: false, //Hide/Show Generator
          activateAd: false, //Hide/Show Activate Ad Msg
          adUrlline: true, //Hide/Show link to activate ad
          activateAdurl: '#',
          verifying: true, //Hide/Show Verifying Campaign Msg
          showError: false, //Hide/Show Error Msg
          dspsett: false,    //Hide/Show DSP Settings
          cdspsett: false,    //track whether DSP Settings is showing or not when Inv Settings is opened
          invsett: false,    //Hide/Show Inv Settings
          cinvsett: false,    //track whether Inv Settings is showing or not when DSP Settings is opened
          moretrackers: false,//Hide/Show more trackers
          InvSettText: "Advanced Settings >>",//Text for toggling Hide/Show Advanced Settings
          deleteDSP: false, //Hide/Show Delete DSP Modal
          showAdtagmsg: true, //Hide/Show ad tag tooltip
          adTagspinner:false,
          adTagmsg: "", //Content of ad tag tootip
          isInApp: false,
          disableedit: true,
          disabletmc: true,
          disablecbt: true,
          reupdate: true,
          // userEmail: window.user.email,
          userId: 3354,
          timezone: '08:00',
          pend: false, //Hide/Show Msgbox
          pendMsg: '', //Msgbox content
          msgSign: 0, //Icon for Msgbox: 1 = checked, 2 = X, 3 = exclaimation
          spinner: false, //Load Spinner in Msgbox
          deleteBtn: true, //Hide/Show Delete Dsp button
          updatedDSPname: '', //Name of last updated dsp
          definedDSP: {
            'Bucksense' : {
              'name': 'Bucksense',
              'cachebuster': '%%CACHE_BUSTER%%',
              'cte': '%%CLICK_TRACKER%%',
              'tag': ["'dsp':'Bucksense'", "'exchange':'%%EXCHANGE_ID%%'", "'inventory':'%%APP_BUNDLE_ENC%%'", "'uniqueId':'%%DEVICE_IOS_IFA%%%%DEVICE_ANDROID_IFA%%'"]
            },
            'PocketMath': {
              'name': 'PocketMath',
              'cachebuster': '${imp_id}',
              'click-macro': '${click_url}',
              'tmc': "{'dsp':'PocketMath','macro':{'macro_imp_id' : '${imp_id}','macro_gaid' : '${gaid}', 'macro_ifa' : '${ifa}', 'macro_source_id' : '${source_id}', 'macro_bundle_id' : '${bundle_id}', 'macro_sha1_dpid' : '${sha1_dpid}', 'macro_sha1_did' : '${sha1_did}', 'macro_campaign_id' : '${campaign_id}', 'macro_order_id' : '${order_id}', 'macro_timestamp' : '${timestamp}' }}",
              'tag': ["'dsp':'PocketMath'", "'exchange':'${exchange}'", "'inventory':'${source_id}'", "'uniqueId':'${device_identifier}'"]
            },
            'SiteScout': {
              'name': 'SiteScout',
              'cachebuster': '{ts}',
              'click-macro': '{clickMacro}',
              'tmc': "{'dsp':'SiteScout','macro':{'macro_dpId': '{dpId}','macro_postbackId': '{postbackId}','macro_networkId': '{networkId}','macro_siteId': '{siteId}','macro_campaignId': '{campaignId}','macro_adId': '{adId}', 'macro_appId' : '{appId}', 'macro_did' : '{did}', 'macro_device' : '{device}', 'macro_carrier' : '{carrier}' }}",
              'tag': ["'dsp':'SiteScout'", "'exchange':'{networkId}'", "'inventory':'{siteId}({appId}{domain})'", "'uniqueId':'{dpid}'"]
            },
            'Appier': {
              'name': 'Appier',
              'tmc': "{'dsp':'Appier','macro':{'macro_did': '${did}','macro_didmd5': '${didmd5}','macro_didsha1': '${didsha1}', 'macro_androidid': '${androidid}', 'macro_mac': '${mac}','macro_macmd5': '${macmd5}','macro_macsha1': '${macsha1}', 'macro_odin': '${odin}','macro_bidobjid': '${bidobjid}','macro_partner_id': '${partner_id}','macro_channel_id': '${channel_id}', 'macro_cid': '${cid}','macro_adid': '${adid}','macro_crid': '${crid}','macro_ho_sub1': '${ho_sub1}','macro_idfa': '${idfa}','macro_uu': '${uu}'}}",
              'tag': ["'dsp':'Appier'", "'exchange':'Appier'", "'inventory':'${channel_id}'", "'uniqueId':'${mac}'"]
            },
            'MediaSmart': {
              'name': 'MediaSmart',
              'cachebuster': '%ts%',
              'click-macro': '%click_url_unesc%',
              'tag': ["'dsp':'MediaSmart'", "'exchange':'%exchange%'", "'inventory':'%site_name%%appname%'", "'uniqueId':'%udid_raw%'"]
            },
            'DBM': {
              'name': 'DoubleClick Bid Manager (DBM)',
              'cachebuster': '${CACHEBUSTER}',
              'click-macro': '${CLICK_URL}',
              'tag': ["'dsp':'DBM'", "'exchange':'${EXCHANGE_ID}'", "'inventory':'${SOURCE_URL}'"]
            },
            'DFP': {
              'name': 'DoubleClick for Publisher (DFP)',
              'cachebuster': '%%CACHEBUSTER%%',
              'click-macro': '%%CLICK_URL_UNESC%%',
              'trackImp': '%%VIEW_URL_UNESC%%',
              'tag': ["'dsp':'DFP'", "'exchange':'%eaid!'", "'inventory':'%%SITE%%'", "'uniqueId':'%%ADVERTISING_IDENTIFIER_PLAIN%%'"]
            },
            'GoogleDisplayNetwork': {
              'name': 'Google Display Network (GDN)',
              'cachebuster': '%%CACHEBUSTER%%',
              'click-macro': '%%CLICK_URL_UNESC%%',
              'polite': true,
              'trackImp': '%%VIEW_URL_UNESC%%',
              'custom-domain': 'track.richmediaads.com',
              'custom-cdn-domain': 'cdn.richmediaads.com',
              'tag': ["'dsp':'gdn'", "'exchange':'gdn'", "'inventory':'%%SITE%%'", "'uniqueId':'%%ADVERTISING_IDENTIFIER_PLAIN%%'"],
            },
            'Bidstalk': {
              'name': 'Bidstalk',
              'cachebuster': '{CACHEBUSTER}',
              'click-macro': '{CLICK_URL}',
              'tmc': "{'dsp':'Bidstalk','macro':{'macro_conversion_id': '{CONVERSION_ID}','macro_campaign_id': '{CAMPAIGN_ID}'}}",
              'tag': ["'dsp':'Bidstalk'", "'exchange':'{EXCHANGE_NAME}'", "'inventory':'{APP_NAME}'", "'uniqueId':'{DEVICE_PLATFORM_ID}'"]
            },
            'AirPush': {
              'name': 'AirPush',
              'cachebuster': '%cachebuster%',
              'tag': ["'dsp':'AirPush'", "'exchange':'AirPush'", "'inventory':'%dapp%'","'uniqueId':'%androidid%%idfa%'"]
            },
            'Appnexus': {
              'name': 'Appnexus',
              'cachebuster': '${CACHEBUSTER}',
              'click-macro': '${CLICK_URL}',
              'tag': ["'dsp':'Appnexus'", "'exchange':'${PUBLISHER_ID}'", "'inventory':'${REFERER_URL_ENC}'", "'uniqueId':'${DEVICE_AAID}${DEVICE_APPLE_IDA}'"]
            },
            'MediaMath': {
              'name': 'MediaMath',
              'cachebuster': '[RANDOM_NUMBER]',
              'click-macro': '[UNENCODED_CLICK_REDIRECT]',
              'tag': ["'dsp':'MediaMath'", "'exchange':'[BID_ATTR.exchange]'", "'inventory':'[BID_ATTR.site]'", "'uniqueId':'[MOBILE_DEVICE_ID]'"]
            },
            'MyDSP': {
              'name': 'MyDSP',
              'cachebuster': '{TIMESTAMP}',
              'click-macro': '{CLICK_URL}',
              'tag': ["'dsp':'MyDSP'", "'exchange':'{EXCHANGE}'", "'inventory':'{DOMAIN}'", "'uniqueId':'{ADVERTISING_ID}{IDFA}'"]
            },
          },
          customDSP: {
            'New DSP': {
              "name":"Other"
            },
          },
          campaignlist:  [], //list for campaign <select>
          campaignId: '', //v-model of campaign <select>
          dspName: '', //v-model of dsp <select>
          dspNameinput: '', //v-model of dsp name input
          cm: '', //v-model of click macro
          nondirmac: false, //v-model of non redirect checkbox + v-bind:disabled of escape macro radio btn
          escMacro: 'ct', //v-model of escape macro radio button
          cb: '', //v-model of cachebuster
          exchMac: '', //v-model of exchange macro
          invMac: '', //v-model of inventory macro
          devidMac: '',  //v-model of device id macro
          impMac: '',//v-model of impression macro
          fetMac: '', //v-model of fet macro
          cteMac: '', //v-model of clickthrough macro
          secure: true, //v-model of secure serving checkbox
          polite: false, //v-model of polite checkbox
          tmc: false, //v-model of tune marketing checkbox
          cbt: false, //v-model of close button timer checkbox
          cbttime: 5, //v-model of number input of close button timer
          ifrview: true, //v-model of iframe viewability checkbox
          forceStatic: false, //v-model of force static viewability checkbox
          trackImp: '', //v-model of impression tracker
          fet: '', //v-model of first engagement tracker
          cte: '', //v-model of clickthrough tracker
          trackExp: '', //v-model of click-to-expand tracker
          tc: '', //v-model of tab click
          firstRun: 0, //number of times generateAdtag has run
          isVast: false, //is ad format VST?
          vastVersion: "3.0",
          vastFormat: "xml",
          skv: false, //v-model of skip video checkbox
          vidtime: 5, //v-model of number input of video timer,
          testerLink: 'https://cdn.richmediaads.com/tester/index.html',
          firstLoad: true
        }
      },
      openChatbot: function() {
        window.LandbotLivechat.open();
        if (window.Intercom) {
          Intercom('hide');
        }
      },
      showDSPsett: function () {
        if (this.dspsett == false) {
          this.InvSettText = "Advanced Settings >>"
          this.dspsett = true;
          this.cdspsett = true;
          this.invsett = false;
        }
      },
      closeDSPsett: function () {
        this.dspsett = false
        this.cdspsett = false
        if (this.cinvsett == true) {
            this.toggleInvsett()
        }
      },
      toggleInvsett: function () {
        this.dspsett = false
        if (this.invsett == false) {
          this.invsett = true
          this.cinvsett = true
          this.InvSettText = "<< Hide Advanced Settings"
        }
        else {
          this.invsett = false
          this.cinvsett = false
          this.InvSettText = "Advanced Settings >>"
          if (this.cdspsett == true) {
            this.showDSPsett()
          }
        }
      },
      closeGenerator: function() {
        $.extend(this.$data,this.resetdata());
        //Object.assign(this.$data, this.resetdata());
      },
      inputSettings: function() {
        var modal = this;
        var dsp;

        function decodeTags (tagdata) {
          var tag;
          modal.dspNameinput = '';
          modal.exchMac = '';
          modal.invMac = '';
          modal.devidMac = '';
          for ( var t = 0; t < tagdata.length; t++ ) {
            tag = tagdata[t].replace(/'/g, '').split(":");
            switch ( tag[0] ) {
              case 'dsp':
                modal.dspNameinput = tag[1];
                break;
              case 'exchange':
                modal.exchMac = tag[1];
                break;
              case 'inventory':
                modal.invMac = tag[1];
                break;
              case 'uniqueId':
                modal.devidMac = tag[1];
                break;
            }
          }
        }

        function getMacrovalue (istext, index, defaulvalue) {
          var value;
          if ( dsp[index] ) {
            if ( istext ) {
              if (typeof dsp[index] == 'object') {
                value = '';
                for (var i in dsp[index]) {
                  value += dsp[index][i] + ' ';
                }
                value = value.slice(0, -1);
              }
              else {
                value = dsp[index];
              }
            }
            else {
              value = dsp[index];
            }
          }
          else {
            if ( typeof dsp[index] ==  'boolean' ) {
              value = false;
            }
            else {
              value = defaulvalue;
            }
          }
          return value;
        }

        if ( modal.definedDSP[modal.dspName] ) { // if predefined dsp is selected
          dsp = modal.definedDSP[modal.dspName];
          modal.disableedit = true;
          modal.dspsett = false;
          modal.cdspsett = false;
          if (modal.cinvsett == true) {
            modal.invsett = true;
          }
        }
        else {
          dsp = modal.customDSP[modal.dspName];
          modal.disableedit = false;
        }

        if ( dsp['tag'] ) { // if predefined dsp or saved custom dsp is selected which will have 'tag'
          decodeTags( dsp['tag'] );
        }
        else { //Add New DSP is selected
          modal.dspNameinput = 'New DSP';
          modal.exchMac = '';
          modal.invMac = '';
          modal.devidMac = '';
        }

        modal.cm = getMacrovalue ( true, 'click-macro', '');
        modal.nondirmac = getMacrovalue ( false, 'non-redirect-macro', false );
        modal.escMacro = getMacrovalue ( true,'click-escape', 'ct');
        modal.cb = getMacrovalue ( true, 'cachebuster', '');
        modal.secure = getMacrovalue ( false, 'secure', true);
        modal.polite = getMacrovalue ( false, 'polite', false);
        modal.tmc = getMacrovalue ( false, 'usetmc', false);
        modal.cbt = getMacrovalue ( false, 'cbt', false);
        modal.cbttime = getMacrovalue ( false, 'cbttime', 5);
        modal.forceStatic = getMacrovalue(false,'forceStatic', false);
        modal.trackImp = getMacrovalue ( true, 'trackImp', '');
        modal.fet = getMacrovalue ( true, 'fet', '' );
        modal.cte = getMacrovalue ( true, 'cte', '' );
        modal.trackExp = getMacrovalue ( true, 'trackExp', '');
        modal.tc = getMacrovalue (true, 'tc', '');
        modal.impMac = getMacrovalue(true, 'impMac', '');
        modal.cteMac = getMacrovalue(true, 'cteMac', '');
        modal.fetMac = getMacrovalue(true, 'fetMac', '');

        /*Disable loading of external trackers for custom dsp*/
        if ( modal.customDSP[modal.dspName] ) { //custom dsp selected
          modal.trackImp = '';
          if ( modal.dspName != 'Offdeck' ) {
            modal.fet = '';
          }
          modal.cte = '';
          modal.trackExp = '';
          modal.tc = '';
        }

        if ( this.timezone == "+09:00") {
          modal.ifrview = getMacrovalue(false, 'ifViewability', false);
        }
        else{
          modal.ifrview = getMacrovalue(false, 'ifViewability', true);
        }

        if ( dsp['tmc'] ) { //note: dsp['tmc'] refers to 'tmc'string in dsp object, while modal.tmc is checkbox
          modal.disabletmc = false;
        }
        else {
          modal.disabletmc = true;
        }

        if ( modal.isVast == true ) {
          if (this.dspName != 'New DSP') {
            this.generateVasttag();
          }
          this.testerLink = 'https://developers.google.com/interactive-media-ads/docs/sdks/html5/vastinspector';
        }
        else {
          this.generateAdtag();
          this.testerLink = 'https://cdn.richmediaads.com/tester/index.html';
        }
      },
      generateAdtag: function() {
        var modal = this;
        var index = this.getSelectedcamp();
        var dsp;
        var adtag = '';
        var rmtype;
        var comment;
        var format = '';
        var totalInApp;
        var MD5ID;
        var isCustomAd;
        var encCamId;
        var iframe = '';
        var cusTrack = '';
        var protocol = 'https://';
        var maCusTrackUrl = 'www.cdn.serving1.net/a/analytic.htm?uid=0&isNew={{isNew}}&referredUrl={{referredUrl}}&rmaId={{rmaId}}&domainId=0&pageLoadId={{pageLoadId}}&userId={{userId}}&pubUserId=0&campaignId={{campaignId}}&browser={{browser}}&os={{os}}&domain={{domain}}&callback=trackSuccess&callback=trackSuccess&type={{rmatype}}&tt={{rmatt}}&value={{rmavalue}}';
        var tags = '';
        var trackDomain = 'www.cdn.serving1.net'; //'track.richmediaads.com'  'www.cdn.serving1.net'
        var customDomain = '';
        var tempCDNDom = 'cdn.serving1.net'; //'cdn.richmediaads.com' 'cdn.serving1.net'
        var customCDNDomain = '';
        var adblockTracker = '';
        var additionalHtmltag = '';

        function removeSpace (str) {
          return str.trim().replace(/\s+/g, '');
        }

        function addTracker( trackername, trackerdata ) {
          trackerdata = trackerdata.trim();
          trackerdata = trackerdata.replace(/\s+/g, ' ');
          trackerdata = trackerdata.replace(/[\n\r]/g, ' ');
          var trackers = trackerdata.split(" ");
          var url = trackers.filter(function (val, index, self) { //remove duplicated entry
            return index == self.indexOf(val);
          });
          if ( url.length == 1 ) {
            if ( url[0] ) {
              if ( modal.dspName == 'Offdeck' && trackername == 'fet') {
                adtag += "\n'" + trackername + "':" + url + ",";
              }
              else {
                adtag += "\n'" + trackername + "':'" + url + "',";
              }
            }
          }
          else {
            adtag += "\n'" + trackername + "':['" + url.join("','") + "'],";
          }
        }

        function addImgurlParam () {
          var params = {
            cb:modal.cb,
            dsp:modal.dspNameinput,
            exchange:modal.exchMac,
            inventory:modal.invMac,
            uniqueId:modal.devidMac
          };
          $.each( params, function (i, v) {
            if ( params[i] ) {
              adtag += '&' + i + '=' + removeSpace(v);
            }
          });
        }

        if ( modal.timezone == "+09:00" ) {
          trackDomain = 'track.richmediaads.com';
          tempCDNDom = 'cdn.richmediaads.com';
        }

        if ( modal.definedDSP[modal.dspName] ) { // if predefined dsp is selected
          dsp = modal.definedDSP[modal.dspName];
        }
        else {
          dsp = modal.customDSP[modal.dspName];
        }

        if ( this.campaignlist[index].adFormat == 'IST' ) {
          this.disablecbt = false;
        }
        else {
          if ( modal.dspName == 'GoogleDisplayNetwork' || modal.dspName == 'DFP') {
            modal.trackImp = '';
          }
          this.disablecbt = true;
        }

        //'tag' generation
        if ( modal.dspNameinput ) {
          tags += "'dsp':'" + removeSpace(modal.dspNameinput) + "',\n";
        }
        if ( modal.exchMac ) {
          tags += "'exchange':'" + removeSpace(modal.exchMac) + "',\n";
        }
        else {
          tags += "'exchange':'" + removeSpace(modal.dspNameinput) + "',\n";
        }
        if ( modal.invMac ) {
          tags += "'inventory':'" + removeSpace(modal.invMac) + "',\n";
        }
        else {
          tags += "'inventory':'{{rmaDomain}}" + "',\n";
        }
        if ( modal.devidMac ) {
          tags += "'uniqueId':'" + removeSpace(modal.devidMac) + "',\n";
        }
        tags = tags.replace(/,\n$/g, '\n');

        //custom/additional settings
        if ( dsp['custom-domain'] ) {
          customDomain = dsp['custom-domain'];
          trackDomain = customDomain;
        }
        if ( dsp['custom-cdn-domain'] ) {
          customCDNDomain = dsp['custom-cdn-domain'];
          tempCDNDom = customCDNDomain;
        }
        if ( dsp['adblock-tracker'] ) {
          adblockTracker = dsp['adblock-tracker'];
        }
        if ( dsp['additional-html-tag'] ) {
          additionalHtmltag = '\n' + dsp['additional-html-tag'];
        }

        if ( window.location.hostname.indexOf('test.') > -1 ) { //on test server
          trackDomain = 'testtrack.richmediaads.com';
          tempCDNDom = 'testcdn.mobileads.com';
        }

        totalInApp = 0;
        MD5ID = modal.campaignlist[index].MD5ID;
        isCustomAd = modal.campaignlist[index].isCustomAd;

        if ( typeof totalInApp != 'undefined'  && typeof MD5ID != 'undefined' && typeof isCustomAd != 'undefined') {
          compileAdtag();
        }
        else {
          modal.showTooltip('Generating...', 0 ,true);
          axios.get('/api/get_ad_tag' , { //retrieve totalInApp, M5ID, and isCustomAd
            params: {
              campaignId: modal.campaignId,
              userId: modal.userId,
            }
          }).then(function (res) {
            console.log(res);
            var data = res.data.result;
            totalInApp = data.totalInApp;
            modal.campaignlist[index].totalInApp = totalInApp;
            MD5ID = data.MD5ID;
            modal.campaignlist[index].MD5ID = MD5ID;
            isCustomAd = data.isCustomAd;
            modal.campaignlist[index].isCustomAd = isCustomAd;
            compileAdtag();
            modal.showTooltip( '', 1, false );
          }).catch(function (error) {
            modal.showTooltip('Failed to Generate Ad Tag\n Please try again', 3500, false);
          });
        }

        function compileAdtag() {
          if ( totalInApp > 0 ){
            rmtype = "MRAID";
            iframe = "\n'iframe':false,";
          }
          else{
            rmtype = modal.isInApp ? "MRAID" : "Javascript";
          }

          encCamId = MD5ID;

          if ( modal.secure == true ) {
            protocol = 'https://';
          }
          else{
            protocol = 'http://';
          }

          format = modal.campaignlist[index].adFormat.replace('EMD', 'Embedded').replace('EXP', 'Expandable').replace('IST', 'Interstitial').replace('VST', 'VAST');

          comment = '<!--\nMobileAds Ad Tag\nCampaign: ' + modal.campaignlist[index].name +
          '\nDSP: ' + modal.dspNameinput +
          '\nAd Tag Type: ' + rmtype +
          '\nAd Format: ' + format + '\n-->';

          adtag = comment + "\n<script type='text/javascript'>";

          if ( dsp == modal.customDSP['Offdeck'] ) {
            adtag += "\nvar IbnMacro = IbnMacro || {" +
            "\nadsTransactionId: '',\ndecimalIp: '',\ntargetUrl: '',\nclickUrl: 'http://ads.indosatooredoo.com/ads-click?adsTransactionId=<<ADS_TRANSACTION_ID>>&targetUrl=<<TARGET_URL>>&i=<<DECIMAL_IP>>'," +
            "\nstart: function start() {" +
            "\nvar search = location.search;\nif(typeof search !== 'undefined' && search !== null){\nif(search.indexOf('?') == 0)\nsearch = search.substring(1);\nvar temps = search.split('&');\nvar params = new Array();\nfor(var i = 0; i<temps.length; i++){\nvar temp = temps[i].split('=');\nparams[temp[0]] = temp[1];\n}\nthis.adsTransactionId = (params.adsTransactionId) ? params.adsTransactionId : '';\nthis.decimalIp = (params.i) ? params.i : '';\nthis.clickUrl = this.clickUrl.replace('<<ADS_TRANSACTION_ID>>',this.adsTransactionId).replace('<<TARGET_URL>>', encodeURIComponent(this.targetUrl)).replace('<<DECIMAL_IP>>', this.decimalIp);\n}\n}\n};\nIbnMacro.start();" +
            "\nif(!IbnMacro){var IbnMacro={adTransactionId:'IbnMacro.adTransactionId',clickUrl:'IbnMacro.clickUrl'};}";
          }

          adtag += "\nvar rma = {\n'campaignId':'" + encCamId +
          "',\n'secure':" + modal.secure + ",";

          if ( modal.polite == true ) {
            adtag += "\n'polite':true,";
          }

          adtag += "\n'ifViewability':" + modal.ifrview + ",";

          if (modal.forceStatic == true) {
            adtag += "\n'forceStatic':true,";
          }

          if ( modal.cb ) {
            if ( dsp == modal.customDSP['Offdeck'] ) {
              adtag += "\n'cb':" + removeSpace(modal.cb) + ",";
            }
            else {
              adtag += "\n'cb':'" + removeSpace(modal.cb) + "',";
            }
          }
          if ( modal.nondirmac == false ) {
            if ( modal.cm ) {
              adtag += "\n'" + modal.escMacro + "':'" + removeSpace(modal.cm) + "',";
            }

            if ( removeSpace(modal.cteMac) == removeSpace(modal.fetMac) ) {
              addTracker( 'cte', removeSpace(modal.cteMac) + " " + modal.cte );
              addTracker( 'fet', modal.fet );
            }
            else {
              addTracker( 'cte', removeSpace(modal.cteMac) + " " + modal.cte );
              addTracker( 'fet', removeSpace(modal.fetMac) + " " + modal.fet );
            }
            /*if ( modal.cte ) {
              addTracker ( 'cte', modal.cte );
            }*/
          }
          else {
            if ( removeSpace(modal.cteMac) == removeSpace(modal.fetMac) ) {
              addTracker ( 'cte', removeSpace(modal.cm) + " " + removeSpace(modal.cteMac) + " " + modal.cte );
              addTracker( 'fet',  modal.fet );
            }
            else {
              addTracker( 'cte', removeSpace(modal.cm) + " " + removeSpace(modal.cteMac) + " " + modal.cte );
              addTracker( 'fet', removeSpace(modal.fetMac) + " " + modal.fet );
            }
            /*if ( modal.cm || modal.cte ) {
              addTracker ( 'cte', modal.cte + " " + removeSpace(modal.cm) );
            }*/
          }

          if ( modal.impMac || modal.trackImp) {
            if ( modal.campaignlist[modal.getSelectedcamp()].adFormat != 'IST' ) {
              addTracker( 'trackImp', modal.trackImp );
            }
            else {
              addTracker( 'trackImp', modal.trackImp + " " + modal.impMac );
            }

          }

          if ( modal.trackExp ) {
            addTracker ( 'trackExp', modal.trackExp );
          }
          if ( modal.tc ) {
            addTracker ( 'tc', modal.tc );
          }
          if ( isCustomAd == true ) {
            cusTrack = "\n'customize':{" + iframe + "\n'custTracker':[\n'" + protocol + maCusTrackUrl + "']},";
            adtag += cusTrack;
          }
          if ( modal.tmc == true ) {
            if ( modal.disabletmc == false ) {
              adtag += "\n'dspMacro':" + dsp.tmc + ",";
            }
          }
          if ( modal.cbt == true ) {
            if (modal.disablecbt == false ) {
              if ( modal.cbttime ) {
                if ( modal.cbttime > 0 ) {
                  if ( modal.cbttime <= 30 ) {
                    adtag += "\n'closeBtnTimer':" + modal.cbttime + ",";
                  }
                  else {
                    adtag += "\n'closeBtnTimer':30,";
                  }
                }
              }
            }
          }
         /* if ( modal.fet ) {
            if ( dsp == modal.customDSP['Offdeck'] ) {
              adtag += "\n'fet':" + modal.fet + ",";
            }
            else {
              addTracker ( 'fet', modal.fet );
            }
          }*/
          if ( tags ) {
            adtag += "\n'tags':{\n" + tags + "}";
          }
          adtag += "\n};\n<\/script>" +
          "\n<img src='" + protocol + trackDomain + "/t?i=" + encCamId;
          addImgurlParam();
          adtag += "&customId=noblock' width='1px' height='1px' style='display:none'";
          if ( customDomain == '' ) {
            adtag += " onerror=\"this.onerror=null;this.src='" + protocol + "track.richmediaads.com/t?i=" + encCamId;
            addImgurlParam();
            adtag += "&customId=adblock';";
            if ( adblockTracker != "" ) {
              adtag += "document.body.appendChild((new Image(1,1).src='" + adblockTracker + "').style.display='none');";
            }
          }
          adtag += "\" />";
          if ( rmtype == "MRAID" ) {
            adtag += "<script " + "src='mraid.js'><" + "/script>";
          }
          adtag += "<script type='text/javascript' src='" + protocol + tempCDNDom + "\/general.js'><\/script>" +
          additionalHtmltag;

          $('#ad-tag-text').val(adtag);
          if ( modal.firstRun > 0 ) {
            $('#ad-tag-text').select();
          }
          modal.firstRun++;

        }
      },
      saveDSP: function() {
        var modal = this;

        function dspObject (name) {
          this.name = name;
        }

        function encodeTag () {
          var tag = [];
          if ( modal.dspNameinput ) {
            tag.push("'dsp':'" + modal.dspNameinput + "'");
          }
          if ( modal.exchMac ) {
            tag.push("'exchange':'" + modal.exchMac + "'");
          }
          if ( modal.invMac ) {
            tag.push("'inventory':" + modal.invMac + "'");
          }
          if ( modal.devidMac ) {
            tag.push("'uniqueId':" + modal.devidMac + "'");
          }
          return tag;
        }

        var obj = new dspObject(modal.dspNameinput);
        obj['click-macro'] = modal.cm;
        obj['non-redirect-macro'] = modal.nondirmac;
        obj['click-escape'] = modal.escMacro;
        obj['cachebuster'] = modal.cb;
        obj['tag'] = encodeTag();
        obj['secure'] = modal.secure;
        obj['polite'] = modal.polite;
        obj['forceStatic'] = modal.forceStatic;
        obj['usetmc'] = modal.tmc;
        obj['cbt'] = modal.cbt;
        obj['cbttime'] = modal.cbttime;
        obj['trackImp'] = modal.trackImp;
        obj['fet'] = modal.fet;
        obj['cte'] = modal.cte;
        obj['trackExp'] = modal.trackExp;
        obj['tc'] = modal.tc;
        obj['ifViewability'] = modal.ifrview;
        obj['impMac'] = modal.impMac;
        obj['cteMac'] = modal.cteMac;
        obj['fetMac'] = modal.fetMac;

        var sobj = {};
        sobj[modal.dspNameinput] = obj;

        var exist = false;
        $.each( modal.customDSP ,function (i, v) {
          if ( i == modal.dspNameinput ) {
            exist = true;
          }
        })

        modal.updatedDSPname = modal.dspName;
        this.customDSP[modal.dspNameinput] = obj;
        // this.dspName = modal.dspNameinput;
        // modal.pend = true;
        // modal.pendMsg = 'Updating';
        // modal.spinner = true;
        // modal.msgSign = 0;
        // if ( exist == true ) { //update
        //   console.log('update');
        //   axios.post('/api/dsp/' + modal.userId +'/' + modal.dspNameinput, sobj).then( function (res) {
        //     modal.MsgBox('DSP Updated', 2000, false, true, 1);
        //     modal.closeDSPsett();
        //   }).catch( function (error) {
        //     modal.MsgBox('Failed to update DSP', 2000, false, false, 2);
        //   });
        // }
        // else { //create
        //   console.log('create');
        //   modal.updatedDSPname = modal.dspNameinput;
        //   axios.put('/api/dsp/' + modal.userId +'/' + modal.dspNameinput, sobj).then( function (res) {
        //     modal.MsgBox('DSP Saved', 2000, false, true, 1);
        //     modal.closeDSPsett();
        //   }).catch( function (error) {
        //     modal.MsgBox('Failed to save DSP', 2000, false, false, 2);
        //   });
        // }
      },
      saveAndupdate: function() {
        var n = [];
        $.each( this.definedDSP, function(i, v)  {
         n.push(v.name);
        });
        function removeSpace (str) {
          return str.trim().replace(/\s+/g, '');
        }
        if ( this.definedDSP[this.dspName] ) {
          console.log('predefined dsp, not saved');
          if ( this.isVast == true ) {
            this.generateVasttag();
          }
          else{
            this.generateAdtag();
          }
        }
        else {
          if ( removeSpace(this.dspNameinput) && this.dspNameinput != 'New DSP' && n.indexOf(this.dspNameinput) < 0) {
            if ( this.isVast == true ) {
              if (this.dspName != this.dspNameinput) {
                this.dspName = this.dspNameinput;
              }
              else {
                this.generateVasttag();
              }
            }
            else{
              if (this.dspName != this.dspNameinput) {
                this.dspName = this.dspNameinput;
              }
              else {
                this.generateAdtag();
              }
            }
            this.saveDSP();
          }
          else{
            if ( n.indexOf(this.dspNameinput) < 0 ) {
              this.MsgBox('Please name this DSP', 2000, false, false, 3);
            }
            else {
              this.MsgBox('Please enter another name for this DSP', 2000, false, false, 3);
            }
            this.showDSPsett();
          }
        }
      },
      showTooltip: function (msg, duration, spinner){
        var modal = this;
        this.adTagmsg = msg;
        this.showAdtagmsg = true;
        if ( spinner == true ) {
          modal.adTagspinner = true;
        }
        else {
          modal.adTagspinner = false;
        }
        if ( duration > 0 ) {
          setTimeout(function () { modal.showAdtagmsg = false; }, duration);
        }
      },
      MsgBox: function (msg, duration, spin, refreshDSP, sign) {
        var modal = this;
        modal.pend = true;
        modal.pendMsg = msg;
        modal.spinner = spin;
        modal.msgSign = sign;
        if ( duration ) {
          setTimeout(function () {
            modal.pend = false;
            if ( refreshDSP == true ) {
              modal.reupdate = false;
              modal.getDSPlist();
            }
          }, duration);
        }
        else {
          setTimeout(function () {
            modal.pend = false;
            if ( refreshDSP == true ) {
              modal.reupdate = false;
              modal.getDSPlist();
            }
          }, 2000);
        }
      },
      deleteDSPforSure: function () {
        var modal = this;
        modal.deleteDSP = false;
        modal.pend = true;
        modal.pendMsg = 'Deleting';
        modal.msgSign = 0;
        modal.spinner = true;
        modal.updatedDSPname = '';
        delete this.customDSP[this.dspName];
        modal.MsgBox('DSP Deleted!', 2000, false, true, 1);
        this.dspName = 'Bucksense';
        // console.log(this.customDSP.length, this.customDSP);
        // axios.delete('/api/dsp/' + modal.userId + '/' + modal.dspName
        // ).then( function (res) {
        //   console.log('deleted');
        //   modal.MsgBox('DSP Deleted!', 2000, false, true, 1);
        // }).catch( function (error) {
        //   modal.MsgBox('Failed to delete DSP!', 2000, false, false, 2);
        // });
      },
      getDSPlist: function() {
        var modal = this;
 /*       modal.customDSP = {
          'New DSP': {
            "name":"Add New DSP"
          }
        };*/
        function selectDsp() {
          var count = 0;
          var i;
          var n = [];
          for (i in modal.customDSP) {
            if (modal.customDSP.hasOwnProperty(i)) {
              n.push(i);
              count++;
             }
          }
          if ( count > 1 ) {
            if ( modal.updatedDSPname != '' ) {
              modal.dspName = modal.updatedDSPname;
            }
            else{
              modal.dspName = n[count - 1];
            }
          }
          else {
            modal.dspName = 'Bucksense';
          }
        }

        modal.pend = true;
        modal.pendMsg = 'Refreshing DSP list'
        modal.spinner = true;
        modal.msgSign = 0;
        selectDsp();
        modal.pend = false;
        // axios.get('/api/dsp/' + modal.userId).then( function (res) {
        //   $.each(res.data, function(i, v) {
        //     var dumo = JSON.parse(v.dspValue);
        //     $.extend(modal.customDSP, dumo);
        //   });
        //   modal.pend = false;
        //   selectDsp();
        // }).catch( function (error) {
        //   console.log(error);
        //   modal.MsgBox('Failed to refresh DSP list!', 2000, false, false, 2);
        //   selectDsp();
        // })
      },
      getSelectedcamp: function() {
        for (var i = 0; i < this.campaignlist.length; i++){
          if ( this.campaignId == this.campaignlist[i].id ){
            return i;
          }
        }
        console.log(i);
        return null;
      },
      generateVasttag: function() {
        var modal = this;
        var dsp;
        var protocol = 'https://';
        var vasttag = '';
        var vasturl = '';
        var xmlpath = '';
        var index = modal.getSelectedcamp();
        var MD5ID = modal.campaignlist[index].MD5ID;
        // var trackDomain = 'www.cdn.serving1.net';
        var trackDomain = 'track.richmediaads.com';
        //Video Properties
        var vidLength = modal.campaignlist[index].vidLength;
        var vidUrl = modal.campaignlist[index].vidUrl;
        var vidClickUrl = modal.campaignlist[index].vidClickUrl;
        var vidtype = ["mp4", "webm", "ogg"];
        var vidresol = [
          {
            res: 'low',
            width: 426,
            height: 240
          },
          {
            res: 'mid',
            width: 640,
            height: 360
          },
          {
            res: 'high',
            width: 854,
            height: 480
          },
          {
            res: 'hd',
            width: 1280,
            height: 720
          }
        ];
        var events = modal.campaignlist[index].events;

        //tracking url
        var rmaerror = 'video_error';
        var rmaImp = 'page_view';
        var rmact = 'end_image_click';
        var rmainview = "in_view";

        var uid = '0';
        //var isNew = 'false'; //r
        //var referredUrl = ''; //r
        var pubUserId = modal.campaignlist[index].pubUserId;
        var rmaId = modal.campaignlist[index].rmaId;
        //var domainId = '';  //r
        var pageLoadId = modal.cb;
        //var p = ''; //r
        var tabId = modal.campaignlist[index].tabId;
        //var domain = ''; //r
        //var customId = '';  //r

        if ( modal.definedDSP[modal.dspName] ) { // if predefined dsp is selected
          dsp = modal.definedDSP[modal.dspName];
        }
        else {
          dsp = modal.customDSP[modal.dspName];
        }

        /*if ( modal.timezone == "+09:00" ) {
          trackDomain = 'track.richmediaads.com';
        }

        if ( dsp['custom-domain'] ) {
          trackDomain = dsp['custom-domain'];
        }

        if ( window.location.hostname.indexOf('test.') > -1 ) { //on test server
          trackDomain = 'testtrack.richmediaads.com';
        }

        if ( modal.secure == true ) {
          protocol = 'https://';
        }
        else{
          protocol = 'http://';
        }*/
        function removeSpace (str) {
          return str.trim().replace(/\s+/g, '');
        }

        function addTracker( trackername, trackerdata, indent ) {
          trackerdata = trackerdata.trim();
          trackerdata = trackerdata.replace(/\s+/g, ' ');
          trackerdata = trackerdata.replace(/[\n\r]/g, ' ');
          var url = trackerdata.split(" ");
          var s = new Array(indent + 1).join('    ');
          for (var t = 0; t < url.length; t++) {
            vasttag += "\n" + s + "<" + trackername + "><![CDATA[" + url[t] +"]]></" + trackername + ">";
          }
        }

        function compileUrl(type, cb) {
          var compId = '24';
          var value = '';

          if ( type == 'in_view' ) {
            compId = '0';
          }
          if ( type == 'end_image_click' ) {
            value = '&value=0';
          }
          if ( type.indexOf('video_play') > -1 ) {
            var perc = type.split('_');
            if ( perc.length == 2 ) { // type=video_play
              value = '&tv=VP&value=0';
            }
            else { // type=video_play_xx
              let vc = '';
              if ( type.indexOf('100') > -1 ) {
                vc = '&tv=VC'
              }
              value = vc + '&value=' + compilePlaypercentage(perc[2]).toString();
            }
          }

          var _pli = pageLoadId;
          var _cb = modal.cb;
          var _dsp = removeSpace(modal.dspNameinput);
          var _exc = modal.exchMac ? removeSpace(modal.exchMac) : removeSpace(modal.dspNameinput);
          var _inv = removeSpace(modal.invMac);
          var _uid = removeSpace(modal.devidMac);
          if ( modal.vastFormat == 'url' ) {
            _pli = '{{pageLoadId}}';
            _cb = '{{cb}}';
            _dsp = '{{dsp}}';
            _exc = '{{exchange}}';
            _inv = '{{inventory}}';
            _uid = '{{uniqueId}}';
          }
          var url = protocol + trackDomain + '/a/analytic.htm?uid=' + uid + '&type=' + type + '&userId=' + modal.userId + '&pubUserId=' + pubUserId + '&rmaId=' + rmaId + '&tabId=' + tabId + '&componentId=' + compId + '&campaignId=' + MD5ID + value + '&pageLoadId=' + _pli;

          if ( cb == true ) {
           url += '&cb=' + _cb;
          }

          url += '&dsp=' + _dsp;
          url += '&exchange=' + _exc;
          /*if ( modal.exchMac ) {
            url += '&exchange=' + removeSpace(modal.exchMac);
          }
          else{
            url += '&exchange=' + removeSpace(modal.dspNameinput);
          }*/

          if ( modal.invMac ) {
            if ( modal.invMac == '{{rmaDomain}}' ) {
              if ( modal.vastFormat != 'url' ) {
                url += '&inventory=cdn.richmediaads.com';
              }
            }
            else {
              url += '&inventory=' + _inv;
            }
          }
          else{
            if ( modal.vastFormat != 'url' ) {
              url += '&inventory=cdn.richmediaads.com';
            }
          }

          url += '&uniqueId=' + _uid;
          return url;
        }

        function compilePlaypercentage(percent) {
          var vidsec = parseFloat(vidLength)
          var percentage = 1;
          if ( percent != '100' ) {
            percentage = parseFloat('0.' + percent);
          }
          return (vidsec * percentage);
        }

        function compileTime(vidLength) {
          var res = vidLength.split(".");
          var totalsec = parseInt(res[0]);
          if (parseInt(res[1]) > 0 ) {
            totalsec++;
          }
          var s = totalsec % 60;
          var m = Math.floor(totalsec / 60);
          var h = Math.floor(totalsec / 3600);
          if ( m >= 60 ){
            m = m % 60;
          }
          var v = [h.toString(),m.toString(),s.toString()]
          for (var i in v){
            if ( v[i].length < 2 ){
              v[i] = '0' + v[i];
            }
          }
          return v.join(":");
        }

        function compileVasturl(xml) {
          console.log('url');
          var vasturl =  '';
          //var domain = encodeURIComponent('https://rmarepo.richmediaads.com/');
          //if ( window.location.hostname.indexOf("mobileads") < 0 ) {
           // domain = encodeURIComponent('https://rmatestrepo.richmediaads.com/');
         // }

          var xmlpath = modal.userId + '/vast-xml/' + MD5ID + '.xml';
          console.log(modal.userId, MD5ID);
          modal.showTooltip('Generating...', 0 ,true);
          var postData = {
            xml: xml,
              path: modal.userId + '/vast-xml',
              name: MD5ID + '.xml'
          }
          axios.post('https://www.mobileads.com/vast/add?bucket=rmarepo',
            postData
          ).then(function (res) { //retrieve params
            vasturl = 'https://vast.richmediaads.com/vast.php?xmlpath=' + xmlpath + '&pageLoadId=' + pageLoadId + '&cb=' + modal.cb + '&dsp=' + modal.dspNameinput.toLowerCase() + '&exchange=' + modal.exchMac + '&inventory=' +  modal.invMac + '&uniqueId=' + modal.devidMac + '&ct=' + modal.cm;
            $('#ad-tag-text').val(vasturl);
            if ( modal.firstRun > 0 ) {
              $('#ad-tag-text').select();
            }
            modal.showTooltip( '', 1, false );
          }).catch(function (error) {
            console.log(error);
            modal.showTooltip('Failed to Generate VAST URL\n Please try again', 3500, false);
            $('#ad-tag-text').val(xml);
            if ( modal.firstRun > 0 ) {
              $('#ad-tag-text').select();
            }
          });
        }

        function compileVastXML(xml) {
          function removeSpace (str) {
            return str.trim().replace(/\s+/g, '');
          }

          console.log('xml');
          var vastXML = '';
          var vasturl =  '';
          var xmlpath = modal.userId + '/vast-xml/' + MD5ID + '.xml';
          modal.showTooltip('Generating...', 0 ,true);
          var postData = {
            xml: xml,
            path: modal.userId + '/vast-xml',
            name: MD5ID + '.xml'
          }
          axios.post('https://www.mobileads.com/vast/add?bucket=rmarepo',
            postData
          ).then(function(res) {
            vasturl = 'https://vast.richmediaads.com/vast.php?xmlpath=' + xmlpath + '&pageLoadId=' + pageLoadId + '&cb=' + modal.cb + '&dsp=' + modal.dspNameinput.toLowerCase() + '&exchange=' + modal.exchMac + '&inventory=' +  modal.invMac + '&uniqueId=' + modal.devidMac + '&ct=' + modal.cm;
            vastXML = '<?xml version="1.0" encoding="UTF-8"?>\n<VAST version="' + modal.vastVersion +'">';
            vastXML += "\n    <Ad id=\"" + MD5ID + "\">";
            vastXML += "\n    <Wrapper>\n        <AdSystem>MobileAds.com</AdSystem>";
            vastXML += "\n        <VASTAdTagURI><![CDATA[" + vasturl + "]]></VASTAdTagURI>";
            vastXML += "\n        <Impression><![CDATA[" + protocol + trackDomain + "/t?i=" + MD5ID // + "]]></Impression>";
            var params = {
              cb:modal.cb,
              dsp:modal.dspNameinput,
              exchange:modal.exchMac,
              inventory:modal.invMac,
              uniqueId:modal.devidMac
            };
            $.each( params, function (i, v) {
              if ( params[i] ) {
                vastXML += '&' + i + '=' + removeSpace(v);
              }
            });
            vastXML += "]]></Impression>";
            vastXML += "\n    </Wrapper>";
            vastXML += "\n</Vast>";
            $('#ad-tag-text').val(vastXML);
            if ( modal.firstRun > 0 ) {
              $('#ad-tag-text').select();
            }
            modal.showTooltip( '', 1, false );
          }).catch(function(err) {
            console.log(error);
            modal.showTooltip('Failed to Generate VAST URL\n Please try again', 3500, false);
            $('#ad-tag-text').val(xml);
            if ( modal.firstRun > 0 ) {
              $('#ad-tag-text').select();
            }
          });
        }

        function compileVasttag(){
          rmaerror = compileUrl('video_error',false);
          rmaImp = compileUrl('a_v_page_view', true);
          rmact = compileUrl('end_image_click',false);
          rmainview = compileUrl('in_view', false);
          vasttag = '<?xml version="1.0" encoding="UTF-8"?>\n<VAST version="' + modal.vastVersion +'">';
          vasttag += "\n    <Ad id=\"" + MD5ID + "\">";
          vasttag += "\n    <InLine>\n        <AdSystem>MobileAds.com</AdSystem>";
          vasttag += "\n        <AdTitle>" + modal.campaignlist[index].name +"</AdTitle>";
          if ( modal.vastVersion != "2.0" ) {
            vasttag += "\n        <Error><![CDATA[" + rmaerror +"]]></Error>";
          }
          vasttag += "\n        <Impression><![CDATA[" + rmaImp +"]]></Impression>";

          if ( modal.trackImp ) {
            addTracker("Impression", modal.trackImp, 2);
          }

          vasttag += "\n        <Creatives>";
          vasttag += "\n            <Creative id=\"" + rmaId + "\" AdID=\"" + rmaId + "\">" ;

          if ( modal.skv == true ){
            if ( modal.vastVersion != "2.0" ) {
              if ( modal.vidtime >=5 ){
                vasttag += "\n                <Linear skipoffset=\"" + compileTime(modal.vidtime.toString()) + "\">";
              }
              else{
                vasttag += "\n                <Linear skipoffset=\"5\">";
              }
            }
            else {
              vasttag += "\n                <Linear>";
            }
          }
          else{
            vasttag += "\n                <Linear>";
          }
          vasttag += "\n                    <Duration>" + compileTime(vidLength) + "</Duration>";
          vasttag += "\n                    <MediaFiles>";
          for (var vt = 0; vt < vidtype.length; vt++){
            for (var r = 0; r < vidresol.length; r++){
              var cdata = vidUrl.slice(0, -4) + '_' + vidresol[r].res + '.' + vidtype[vt];
              vasttag += "\n                        <MediaFile type=\"video/" + vidtype[vt] + "\" delivery=\"progressive\" width=\"" + vidresol[r].width + "\" height=\"" + vidresol[r].height + "\"><![CDATA[" + cdata + "]]></MediaFile>";
           }
          }
          vasttag += "\n                    </MediaFiles>\n                    <VideoClicks>";

          if ( vidClickUrl ) {
            vasttag += "\n                        <ClickThrough><![CDATA[" + vidClickUrl + "]]></ClickThrough>";
            vasttag += "\n                        <ClickTracking><![CDATA[" + modal.cm + "]]></ClickTracking>";
          }

          vasttag += "\n                        <ClickTracking><![CDATA[" + rmact + "&tt=CTR&ty=E]]></ClickTracking>";
          if ( modal.cte ) {
            addTracker("ClickTracking", modal.cte, 6);
          }
          vasttag += "\n                    </VideoClicks>\n                    <TrackingEvents>";

          $.each(events, function(i, v){
            $.each(events[i], function(e,ev) {
              if ( !(i == 'skip' && modal.vastVersion == "2.0") ) {
                if ( e == 0 ){
                  vasttag += "\n                        <Tracking event=\"" + i + "\"><![CDATA[" + compileUrl(ev,false) + "]]></Tracking>";
                }
                else{
                  vasttag += "\n                        <Tracking event=\"" + i + "\"><![CDATA[" + ev + "]]></Tracking>";
                }
              }
            })
          })

          // if ( modal.vastVersion != "2.0" ) {
          //   vasttag += "\n                        <Tracking event=\"progress\" offset=\"00:00:02\"><![CDATA[" + rmainview +"]]></Tracking>";
          // }
          vasttag += "\n                    </TrackingEvents>\n                </Linear>\n            </Creative>\n        </Creatives>\n    </InLine>\n    </Ad>\n</VAST>";

          if ( modal.vastFormat == 'url' ) {
            compileVasturl(vasttag);
          }
          else {
            // $('#ad-tag-text').val(vasttag);
            // if ( modal.firstRun > 0 ) {
            //   $('#ad-tag-text').select();
            // }
            compileVastXML(vasttag);
          }
          modal.firstRun++;
       }

        if ( typeof MD5ID != 'undefined' ) {
            compileVasttag();
        }
        else {
          // modal.showTooltip('Generating...', 0 ,true);
          pubUserId = 0;
          vidUrl = 'https://rmarepo.richmediaads.com/3354/videos/mov_bbb.mp4';
          rmaId = 164;
          tabId = 1;
          vidLength = '10.026667';
          vidClickUrl = 'http://www.mobileads.com';
          modal.campaignlist[index].MD5ID = '9f32ede9fc5842d5c47cf196bb990974';
          modal.campaignlist[index].vidUrl = vidUrl;
          modal.campaignlist[index].rmaId = rmaId;
          modal.campaignlist[index].tabId = tabId;
          modal.campaignlist[index].vidLength = vidLength;
          modal.campaignlist[index].vidClickUrl = vidClickUrl;
          modal.campaignlist[index].pubUserId = pubUserId;
          modal.campaignlist[index].events = {
            'start': ['video_play'],
            'firstQuartile': ['video_play_25'],
            'midpoint': ['video_play_50'],
            'thirdQuartile': ['video_play_75'],
            'complete': ['video_play_100'],
            'mute': ['video_mute'],
            'unmute': ['video_unmute'],
            'pause': ['video_pause'],
            'rewind': ['video_replay'],
            'skip': ['video_skip'],
          };
          MD5ID = '9f32ede9fc5842d5c47cf196bb990974';
          compileVasttag();

          // axios.get('api/get_vast_tag', {
          //   params:{
          //     campaignId: modal.campaignId,
          //     userId: modal.userId
          //   }
          // }).then(function (res) { //retrieve params
          //   console.log(res);
          //   var sl = res.data.studioList[res.data.studioList.length - 1];
          //   MD5ID = res.data.MD5ID;
          //   if ( MD5ID == '0f1507c396ac04084794b3d57f1a5260' ) { //temporary hardcode -yk
          //     sl = res.data.studioList[0];
          //   }
          //   pubUserId = 0;
          //   vidUrl = 'https://rmarepo.richmediaads.com/3354/videos/mov_bbb.mp4';
          //   rmaId = 164;
          //   tabId = 1;
          //   vidLength = 10.026667;
          //   vidClickUrl = 'http://www.mobileads.com';
          //   modal.campaignlist[index].MD5ID = '9f32ede9fc5842d5c47cf196bb990974';
          //   modal.campaignlist[index].vidUrl = vidUrl;
          //   modal.campaignlist[index].rmaId = rmaId;
          //   modal.campaignlist[index].tabId = tabId;
          //   modal.campaignlist[index].vidLength = vidLength;
          //   modal.campaignlist[index].vidClickUrl = vidClickUrl;
          //   modal.campaignlist[index].pubUserId = pubUserId;
          //   modal.campaignlist[index].events = {
          //     'start': ['video_play'],
          //     'firstQuartile': ['video_play_25'],
          //     'midpoint': ['video_play_50'],
          //     'thirdQuartile': ['video_play_75'],
          //     'complete': ['video_play_100'],
          //     'mute': ['video_mute'],
          //     'unmute': ['video_unmute'],
          //     'pause': ['video_pause'],
          //     'rewind': ['video_replay'],
          //     'skip': ['video_skip'],
          //   };

          //   if ( sl.hvExtTracker.hv_tracker_enable == 1 ){
          //     var evtrackers = sl.hvExtTracker;
          //     if ( evtrackers.hv_play_input ) {
          //       modal.campaignlist[index].events.start.push(evtrackers.hv_play_input);
          //     }
          //     if ( evtrackers.hv_fifty_percent_input ) {
          //       modal.campaignlist[index].events.midpoint.push(evtrackers.hv_fifty_percent_input);
          //     }
          //     if ( evtrackers.hv_hundred_percent_input ) {
          //       modal.campaignlist[index].events.complete.push(evtrackers.hv_hundred_percent_input);
          //     }
          //     if ( evtrackers.hv_seventy_five_percent_input ) {
          //       modal.campaignlist[index].events.thirdQuartile.push(evtrackers.hv_seventy_five_percent_input);
          //     }
          //     if ( evtrackers.hv_twenty_five_percent_input ) {
          //       modal.campaignlist[index].events.firstQuartile.push(evtrackers.hv_twenty_five_percent_input);
          //     }
          //   }
          //   events = modal.campaignlist[index].events;
          //   compileVasttag();
          //   // modal.showTooltip( '', 1, false );
          // }).catch(function (error) {
          //   console.log(error);
          //   modal.showTooltip('Failed to Generate VAST Tag\n Please try again', 3500, false);
          // })
        }
      },
    },
    mounted() {
      var modal = this;
      var index;

      modal.verifying = true;
      // modal.showModal = true 

      // axios.post('/campaign_search').then(function (res) {
        modal.verifying = false;
        //console.log(res.data);
        // var campaigns = res.data.result.result;
        var campaigns = [
          {
            adFormat: 'VST',
            id: 77,
            name: 'test vast'
          }
        ]

        $.each(campaigns, function(i, v) {
          if (campaigns[i].adFormat != "") { // if there's active ad in the campaign
            modal.campaignlist.push({
              name: campaigns[i].name,
              id: 77,
              adFormat: campaigns[i].adFormat,
            });
          }

        });
        modal.campaignId = modal.campaignlist[0].id;
        modal.activateAd = false;
        modal.showGenerator = true;
        modal.getDSPlist();

      // }).catch(function (error) {
      //   modal.verifying = false;
      //   modal.showError = true;
      //   console.log(error);
      // });

      var clip = new clipboard('#copy-ad-tag-btn');
      clip.on('success', function(e) {
        console.info('Action:', e.action);
        modal.showTooltip( 'Ad Tag Copied!', 2000, false);
      });

      clip.on('error', function(e) {
        console.error('Action:', e.action);
        modal.showTooltip( 'Failed to copy, please copy manually', 2000, false);
      });

    },
    watch: {
      dspName() {
        if (!this.firstLoad) {
          if (this.dspName != '' && this.dspName != undefined) {
            if ( this.dspName == 'New DSP' ) {
              this.showDSPsett();
              this.deleteBtn = false;
              // return false;
            }
            else{
              this.deleteBtn = true;
            }
            if ( this.dspName == 'PocketMath' ) {
              this.vastVersion = "2.0";
            }

            if ( this.reupdate == true ) {
              this.inputSettings();
            }
            else{
              this.reupdate = true;
            }
          }
        }
        else {
          this.firstLoad = false;
        }
      },
      campaignId() {
        if ( this.campaignId ) {
          if (this.campaignlist[this.getSelectedcamp()].adFormat == "VST" ) {
            this.isVast = true;
            this.vastFormat = 'xml';
          }
          else{
            this.isVast = false;
          }
          if ( this.dspName != '' ) {
            this.inputSettings();
          }
        }
      },
      isInApp() {
        this.inputSettings();
      },
      vastVersion() {
        this.generateVasttag();
      },
      vastFormat() {
        this.generateVasttag();
      }
    }
  }

</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Lato');
  
  * {
    font-family: 'Lato', sans-serif;
  }

  textarea {
    box-sizing: border-box;
  }

  #campaign-select {
    display: none;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
    overflow-y: auto;
    overflow-x: hidden;
    display: table;
  }

  .modal-wrapper {
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    position: relative;
  }

  .g-modal-container {
    width: 380px;
    padding: 15px 30px;
    background-color: #F7F7F7;
    border-radius: 8px;
    font-family: 'Lato', sans-serif;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin:0px auto;
    transition: all 0.5s;
    height: 550px;
  }

  .g-modal-container.g-modal-wide{
    width:450px;
  }

  .gmodalleft{
    border-radius:12px 0px 0px 12px;
  }

  .gmodalright{
    border-radius:0px 12px 12px 0px;
    border-left:1px solid #999999;
  }

  .g-modal-container button:hover {
    cursor: pointer;
  }

  .closebtn {
    position: absolute;
    top: 2px;
    right: 4px;
    border: none;
    font-size: 28px;
    background-color: transparent;
    color: #696969;

  }

  .g-modal-title {
    font-size: 22px;
    text-align: left;
    padding: 10px;
    padding-left: 0;
    font-weight: 700;
    color:#696969;
  }

  .g-modal-content {
    font-size: 14px;
    text-align: left;
  }

  .g-modal-container.g-modal-msg{
    height: auto;
    padding: 30px;
  }

  .g-modal-container.g-modal-msg div{
    text-align: center;
  }

  .g-modal-container select {
    margin: 15px 0px;
    margin-top: 5px;
    width: 100%;
    padding: 6px;
    border: 1px solid #939393;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
     background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAYAAAA4E5OyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAAA8UlEQVR4Xu3VWw4CIQyF4dmVcW/e9qN7VF5MfBjNjLT0tPwkvEGBLw1nWRgIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIKAsd2iUeheW9vOfTC3lqBZ5F56sV476+AYoZRAcUcIzOKG0ZGFHeMTCjDMDKgnK3SZG8dxfQJw1DslHAMJRQZDAUUOYxIFFmMCBR5jJEol72RGL3eM5LTYXh2SloMD5T0GJYoZTAsUMph9KCUxfgH5RodlaPO3xLJ02Bs6ZTpMH6hTIuxhjI9xicKGKN+cM5BAAEEEEAAAQQQQAABBBBAAAEEEPgu8AKaKcSzY6bUCQAAAABJRU5ErkJggg==);
    background-repeat: no-repeat;
    background-position: 98% 50%;
    background-size: 15px 15px;
    font-size: 12px;
    /*font-family: Arial;*/
  }

  .g-modal-container input[type="checkbox"] {
    margin-bottom: 8px;
  }

  .g-modal-container input[type="text"] {
    margin: 15px 0px;
    margin-top: 5px;
    width: 100%;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #939393;
    box-sizing: border-box;

  }

  .g-modal-container input[type="radio"] {
    margin-top: 5px;
    margin-bottom: 10px;
    margin-left: 15px;
    margin-right: 0px;

  }

  .g-modal-container label:hover {
    cursor: pointer;
  }

  #dsp-select {
    width: 280px;
  }

  optgroup:first-child option:first-child {
    font-style: italic;
  }

  .link-button {
    background-color: transparent;
    text-decoration: underline;
    border: none;
    color: blue;
    font-size: 12px;
    /*font-family: Arial;*/
  }

  #edit-dsp button:disabled:hover ~ #edit-dsp-tooltip{
    display: block;
  }

  #edit-dsp button:disabled:hover {
    cursor: not-allowed;
  }

  #edit-dsp button:disabled {
    color: #D3D3D3;
  }

  #edit-dsp {
    position: absolute;
    right:194px;
    top:11px;
  }

  #edit-dsp-tooltip{
    position: absolute;
    left:-50px;
    display: none;
    width:120px;
  }

  #advance-settings {
    margin-bottom: 10px;
    width:160px;
    text-align: right;
    position: absolute;
    top:11px;
    right:0px;
  }

  .greenline {
    border-width: 1px;
    border-color: #9AC6A2;
    border-radius: 4px;
    border-style: solid;
    margin-bottom: 10px;
  }

  .g-modal-sub-title {
    font-size: 16px;
  }

  #tester-link {
    position: absolute;
    right: 5px;
    font-size: 12px;
    /*font-family: Arial;*/
  }

  #vastVer {
    font-size: 12px;
  }

  #vastVer input[type="radio"]{
    margin-top: 8px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 0px;
    vertical-align: middle;
  }

  #ad-tag-text {
    background-color: rgba(242, 242, 242, 0.73);
    border: 1px solid #bfbebe;
    border-radius: 4px;
    box-shadow: none;
    color: #858585;
    font-size: 14px;
    line-height: 1.42857;
    margin-top: 8px;
    margin-bottom: 6px;
    padding: 12px;
    transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
    width: 100%;
    font-weight: 400;
    resize: none;
    height: 170px;
  }

  #ad-tag-text.isVast {
    height: 298px;
  }

  #ad-tag-text.inAppOpt {
    height: 180px;
  }

  .modal-footer-btn {
    margin-top: 12px;
    text-align: center;
  }

  .modal-btn:hover {
    background-color: #CEC1C4;
  }

  .modal-btn {
    padding: 7px 25px;
    border-radius: 5px;
    border: 1px solid #696969;
    background-color: #EEF1F4;
    font-weight: 500;
    margin-bottom: 4px;
    margin-top: 4px;
    font-size: 14px;
  }

  .modal-btn.danger:hover {
    background-color: #C6493B;
  }

  .modal-btn.danger {
    padding: 7px 15px;
    display: inline-block;
    background-color: #E6695B;
    color: white;
    border: 1px solid #CF5346;
    font-size: 14px;
  }

  .modal-btn.main:hover {
    background-color: #6CC86C;
  }

  .modal-btn.main {
    display: inline-block;
    background-color: #5CB85C;
    color: white;
    border: 1px solid #4CAE4C;
    font-size: 14px;
  }

  .text-red{
    color:#E6695B;
  }

  #cm-input {
    width: 209px;
  }

  #nonrediectmacro {
    margin-left: 10px;
  }

  #cbt-timer {
    width: 40px;
  }

  .dsp-sett {
    width: 400px;
    height: 270px;
    overflow-y: auto;
  }

  .dsp-sett input[type="text"]{
    width: 98%;
  }

  .ext-sett {
    width: 400px;
    height: 295px;
    overflow-y: auto;
    font-size: 12px;
    margin-top: 9px;
  }

  .ext-sett.isVast {
    height: 345px;
  }

  .vast-sett {
    width: 400px;
    height: 170px;
    overflow-y: auto;
    font-size: 12px;
    margin-top: 9px;
  }

  .ext-track {
    border-radius: 4px;
    border: 1px solid #939393;
    margin-top: 3px;
    margin-bottom: 12px;
    padding: 3px;
    width: 378px;
    resize: none;
    height: 40px;
    font-size: 12px;
  }

  #hidetrackers {
    margin-bottom: 10px;
  }

  .g-modal-tooltip {
    background-color: #535353;
    color:white;
    border-radius: 4px;
    padding:5px;
    font-size: 12px;
    text-align: center;
  }

  .g-modal-absolute {
    position: absolute;
    margin:auto;
    left:0px;
    right:0px;
    top:40%;
    border:1px solid #696969;
  }

  #ad-tag-tooltip{
    position: absolute;
    top:150px;
    margin:auto;
    left:0px;
    right:0px;
    width: 150px;
  }

  .modal-transition-enter, .modal-transition-leave-to {
    opacity: 0;
    transform: translateX(-10px);

  }

  .modal-transition-leave-active {
    position: absolute;
  }

  .instruction {
    margin: 5px 0px 30px;
    font-size: 12px;
  }
</style>
