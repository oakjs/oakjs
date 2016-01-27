"use strict";
import React from "react";
import { Card } from "oak";

export default class IconCard extends Card {
  static defaultProps = {
    id: "IconAlphabetical",
    title: "Icon (Alphabetical)"
  }
  renderChildren({ card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Icons">
            An icon is a glyph used to represent something else.

            <c.Message appearance="info">
              Semantic includes a complete port
              of <a href="http://fortawesome.github.io/Font-Awesome/" target="_blank">Font Awesome 4.3</a> designed
              by <a href="https://twitter.com/davegandy" target="_blank">Dave Gandy</a> for its standard icon set.
            </c.Message>
          </c.PageTitle>

          <c.PageSection appearance="doubling six column grid" title="A">
            <c.IconSample icon="add circle"/>
            <c.IconSample icon="add square"/>
            <c.IconSample icon="add to cart"/>
            <c.IconSample icon="add user"/>
            <c.IconSample icon="adjust"/>
            <c.IconSample icon="adn"/>
            <c.IconSample icon="alarm outline"/>
            <c.IconSample icon="alarm slash outline"/>
            <c.IconSample icon="alarm slash"/>
            <c.IconSample icon="alarm"/>
            <c.IconSample icon="align center"/>
            <c.IconSample icon="align justify"/>
            <c.IconSample icon="align left"/>
            <c.IconSample icon="align right"/>
            <c.IconSample icon="american express"/>
            <c.IconSample icon="anchor"/>
            <c.IconSample icon="android"/>
            <c.IconSample icon="angellist"/>
            <c.IconSample icon="angle double down"/>
            <c.IconSample icon="angle double left"/>
            <c.IconSample icon="angle double right"/>
            <c.IconSample icon="angle double up"/>
            <c.IconSample icon="angle down"/>
            <c.IconSample icon="angle left"/>
            <c.IconSample icon="angle right"/>
            <c.IconSample icon="angle up"/>
            <c.IconSample icon="announcement"/>
            <c.IconSample icon="apple"/>
            <c.IconSample icon="archive"/>
            <c.IconSample icon="area chart"/>
            <c.IconSample icon="arrow circle down"/>
            <c.IconSample icon="arrow circle left"/>
            <c.IconSample icon="arrow circle outline down"/>
            <c.IconSample icon="arrow circle outline left"/>
            <c.IconSample icon="arrow circle outline right"/>
            <c.IconSample icon="arrow circle outline up"/>
            <c.IconSample icon="arrow circle right"/>
            <c.IconSample icon="arrow circle up"/>
            <c.IconSample icon="arrow down"/>
            <c.IconSample icon="arrow left"/>
            <c.IconSample icon="arrow right"/>
            <c.IconSample icon="arrow up"/>
            <c.IconSample icon="asterisk"/>
            <c.IconSample icon="at"/>
            <c.IconSample icon="attach"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="B">
            <c.IconSample icon="backward"/>
            <c.IconSample icon="ban"/>
            <c.IconSample icon="bar chart"/>
            <c.IconSample icon="bar"/>
            <c.IconSample icon="barcode"/>
            <c.IconSample icon="behance square"/>
            <c.IconSample icon="behance"/>
            <c.IconSample icon="birthday"/>
            <c.IconSample icon="bitbucket square"/>
            <c.IconSample icon="bitbucket"/>
            <c.IconSample icon="bitcoin"/>
            <c.IconSample icon="block layout"/>
            <c.IconSample icon="bold"/>
            <c.IconSample icon="bomb"/>
            <c.IconSample icon="book"/>
            <c.IconSample icon="bookmark"/>
            <c.IconSample icon="browser"/>
            <c.IconSample icon="bug"/>
            <c.IconSample icon="building outline"/>
            <c.IconSample icon="building"/>
            <c.IconSample icon="bullseye"/>
            <c.IconSample icon="buysellads"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="C">
            <c.IconSample icon="calculator"/>
            <c.IconSample icon="calendar outline"/>
            <c.IconSample icon="calendar"/>
            <c.IconSample icon="call square"/>
            <c.IconSample icon="call"/>
            <c.IconSample icon="camera retro"/>
            <c.IconSample icon="car"/>
            <c.IconSample icon="caret down"/>
            <c.IconSample icon="caret left"/>
            <c.IconSample icon="caret right"/>
            <c.IconSample icon="caret up"/>
            <c.IconSample icon="certificate"/>
            <c.IconSample icon="check circle outline"/>
            <c.IconSample icon="check circle"/>
            <c.IconSample icon="check square"/>
            <c.IconSample icon="checkered flag"/>
            <c.IconSample icon="checkmark box"/>
            <c.IconSample icon="checkmark"/>
            <c.IconSample icon="chevron circle down"/>
            <c.IconSample icon="chevron circle left"/>
            <c.IconSample icon="chevron circle right"/>
            <c.IconSample icon="chevron circle up"/>
            <c.IconSample icon="chevron down"/>
            <c.IconSample icon="chevron left"/>
            <c.IconSample icon="chevron right"/>
            <c.IconSample icon="chevron up"/>
            <c.IconSample icon="child"/>
            <c.IconSample icon="circle notched"/>
            <c.IconSample icon="circle thin"/>
            <c.IconSample icon="circle"/>
            <c.IconSample icon="cloud download"/>
            <c.IconSample icon="cloud upload"/>
            <c.IconSample icon="cloud"/>
            <c.IconSample icon="cocktail"/>
            <c.IconSample icon="code"/>
            <c.IconSample icon="codepen"/>
            <c.IconSample icon="coffee"/>
            <c.IconSample icon="columns"/>
            <c.IconSample icon="comment outline"/>
            <c.IconSample icon="comment"/>
            <c.IconSample icon="comments outline"/>
            <c.IconSample icon="comments"/>
            <c.IconSample icon="compress"/>
            <c.IconSample icon="configure"/>
            <c.IconSample icon="connectdevelop"/>
            <c.IconSample icon="copy"/>
            <c.IconSample icon="copyright"/>
            <c.IconSample icon="crop"/>
            <c.IconSample icon="crosshairs"/>
            <c.IconSample icon="css3"/>
            <c.IconSample icon="cube"/>
            <c.IconSample icon="cubes"/>
            <c.IconSample icon="cut"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="D">
            <c.IconSample icon="dashboard"/>
            <c.IconSample icon="dashcube"/>
            <c.IconSample icon="database"/>
            <c.IconSample icon="delicious"/>
            <c.IconSample icon="desktop"/>
            <c.IconSample icon="deviantart"/>
            <c.IconSample icon="diamond"/>
            <c.IconSample icon="digg"/>
            <c.IconSample icon="discover"/>
            <c.IconSample icon="disk outline"/>
            <c.IconSample icon="doctor"/>
            <c.IconSample icon="dollar"/>
            <c.IconSample icon="download"/>
            <c.IconSample icon="dribbble"/>
            <c.IconSample icon="dropbox"/>
            <c.IconSample icon="dropdown"/>
            <c.IconSample icon="drupal"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="E">
            <c.IconSample icon="edit"/>
            <c.IconSample icon="eject"/>
            <c.IconSample icon="ellipsis horizontal"/>
            <c.IconSample icon="ellipsis vertical"/>
            <c.IconSample icon="emergency"/>
            <c.IconSample icon="empire"/>
            <c.IconSample icon="empty heart"/>
            <c.IconSample icon="empty star"/>
            <c.IconSample icon="erase"/>
            <c.IconSample icon="euro"/>
            <c.IconSample icon="exchange"/>
            <c.IconSample icon="expand"/>
            <c.IconSample icon="external share"/>
            <c.IconSample icon="external square"/>
            <c.IconSample icon="external"/>
            <c.IconSample icon="eyedropper"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="F">
            <c.IconSample icon="facebook square"/>
            <c.IconSample icon="facebook"/>
            <c.IconSample icon="fast backward"/>
            <c.IconSample icon="fast forward"/>
            <c.IconSample icon="fax"/>
            <c.IconSample icon="feed"/>
            <c.IconSample icon="female"/>
            <c.IconSample icon="file archive outline"/>
            <c.IconSample icon="file audio outline"/>
            <c.IconSample icon="file code outline"/>
            <c.IconSample icon="file excel outline"/>
            <c.IconSample icon="file image outline"/>
            <c.IconSample icon="file outline"/>
            <c.IconSample icon="file pdf outline"/>
            <c.IconSample icon="file powerpoint outline"/>
            <c.IconSample icon="file text outline"/>
            <c.IconSample icon="file text"/>
            <c.IconSample icon="file video outline"/>
            <c.IconSample icon="file word outline"/>
            <c.IconSample icon="file"/>
            <c.IconSample icon="film"/>
            <c.IconSample icon="filter"/>
            <c.IconSample icon="find"/>
            <c.IconSample icon="fire extinguisher"/>
            <c.IconSample icon="fire"/>
            <c.IconSample icon="first aid"/>
            <c.IconSample icon="flag outline"/>
            <c.IconSample icon="flag"/>
            <c.IconSample icon="flag"/>
            <c.IconSample icon="flickr"/>
            <c.IconSample icon="folder open outline"/>
            <c.IconSample icon="folder open"/>
            <c.IconSample icon="folder outline"/>
            <c.IconSample icon="folder"/>
            <c.IconSample icon="font"/>
            <c.IconSample icon="food"/>
            <c.IconSample icon="fork"/>
            <c.IconSample icon="forumbee"/>
            <c.IconSample icon="forward mail"/>
            <c.IconSample icon="forward"/>
            <c.IconSample icon="foursquare"/>
            <c.IconSample icon="frown"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="G">
            <c.IconSample icon="game"/>
            <c.IconSample icon="gay"/>
            <c.IconSample icon="gift"/>
            <c.IconSample icon="git square"/>
            <c.IconSample icon="git"/>
            <c.IconSample icon="github alternate"/>
            <c.IconSample icon="github square"/>
            <c.IconSample icon="github"/>
            <c.IconSample icon="gittip"/>
            <c.IconSample icon="google plus square"/>
            <c.IconSample icon="google plus"/>
            <c.IconSample icon="google wallet"/>
            <c.IconSample icon="google"/>
            <c.IconSample icon="grid layout"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="H">
            <c.IconSample icon="h"/>
            <c.IconSample icon="hacker news"/>
            <c.IconSample icon="handicap"/>
            <c.IconSample icon="header"/>
            <c.IconSample icon="heart"/>
            <c.IconSample icon="heartbeat"/>
            <c.IconSample icon="help circle"/>
            <c.IconSample icon="help"/>
            <c.IconSample icon="heterosexual"/>
            <c.IconSample icon="hide"/>
            <c.IconSample icon="history"/>
            <c.IconSample icon="home"/>
            <c.IconSample icon="hospital"/>
            <c.IconSample icon="html5"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="I">
            <c.IconSample icon="idea"/>
            <c.IconSample icon="in cart"/>
            <c.IconSample icon="inbox"/>
            <c.IconSample icon="indent"/>
            <c.IconSample icon="info circle"/>
            <c.IconSample icon="info"/>
            <c.IconSample icon="instagram"/>
            <c.IconSample icon="intergender"/>
            <c.IconSample icon="ioxhost"/>
            <c.IconSample icon="italic"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="J">
            <c.IconSample icon="joomla"/>
            <c.IconSample icon="jsfiddle"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="K">
            <c.IconSample icon="keyboard"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="L">
            <c.IconSample icon="lab"/>
            <c.IconSample icon="laptop"/>
            <c.IconSample icon="lastfm square"/>
            <c.IconSample icon="lastfm"/>
            <c.IconSample icon="leaf"/>
            <c.IconSample icon="leanpub"/>
            <c.IconSample icon="legal"/>
            <c.IconSample icon="lemon"/>
            <c.IconSample icon="lesbian"/>
            <c.IconSample icon="level down"/>
            <c.IconSample icon="level up"/>
            <c.IconSample icon="life ring"/>
            <c.IconSample icon="lightning"/>
            <c.IconSample icon="line chart"/>
            <c.IconSample icon="linkedin square"/>
            <c.IconSample icon="linkedin"/>
            <c.IconSample icon="linkify"/>
            <c.IconSample icon="linux"/>
            <c.IconSample icon="lira"/>
            <c.IconSample icon="list layout"/>
            <c.IconSample icon="list"/>
            <c.IconSample icon="location arrow"/>
            <c.IconSample icon="lock"/>
            <c.IconSample icon="long arrow down"/>
            <c.IconSample icon="long arrow left"/>
            <c.IconSample icon="long arrow right"/>
            <c.IconSample icon="long arrow up"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="M">
            <c.IconSample icon="magnet"/>
            <c.IconSample icon="mail outline"/>
            <c.IconSample icon="mail square"/>
            <c.IconSample icon="mail"/>
            <c.IconSample icon="male"/>
            <c.IconSample icon="man"/>
            <c.IconSample icon="map"/>
            <c.IconSample icon="marker"/>
            <c.IconSample icon="mastercard"/>
            <c.IconSample icon="maxcdn"/>
            <c.IconSample icon="maximize"/>
            <c.IconSample icon="meanpath"/>
            <c.IconSample icon="medium"/>
            <c.IconSample icon="meh"/>
            <c.IconSample icon="military"/>
            <c.IconSample icon="minus circle"/>
            <c.IconSample icon="minus square outline"/>
            <c.IconSample icon="minus square"/>
            <c.IconSample icon="minus"/>
            <c.IconSample icon="mobile"/>
            <c.IconSample icon="money"/>
            <c.IconSample icon="moon"/>
            <c.IconSample icon="move"/>
            <c.IconSample icon="music"/>
            <c.IconSample icon="mute"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="N">
            <c.IconSample icon="neuter"/>
            <c.IconSample icon="newspaper"/>
            <c.IconSample icon="non binary transgender"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="O">
            <c.IconSample icon="openid"/>
            <c.IconSample icon="options"/>
            <c.IconSample icon="ordered list"/>
            <c.IconSample icon="other gender horizontal"/>
            <c.IconSample icon="other gender vertical"/>
            <c.IconSample icon="other gender"/>
            <c.IconSample icon="outdent"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="P">
            <c.IconSample icon="pagelines"/>
            <c.IconSample icon="paint brush"/>
            <c.IconSample icon="paragraph"/>
            <c.IconSample icon="paste"/>
            <c.IconSample icon="pause"/>
            <c.IconSample icon="paw"/>
            <c.IconSample icon="payment"/>
            <c.IconSample icon="paypal card"/>
            <c.IconSample icon="paypal"/>
            <c.IconSample icon="phone square"/>
            <c.IconSample icon="phone"/>
            <c.IconSample icon="photo"/>
            <c.IconSample icon="pie chart"/>
            <c.IconSample icon="pied piper alternate"/>
            <c.IconSample icon="pied piper"/>
            <c.IconSample icon="pin"/>
            <c.IconSample icon="pinterest square"/>
            <c.IconSample icon="pinterest"/>
            <c.IconSample icon="plane"/>
            <c.IconSample icon="play"/>
            <c.IconSample icon="plug"/>
            <c.IconSample icon="plus square outline"/>
            <c.IconSample icon="plus"/>
            <c.IconSample icon="pointing down"/>
            <c.IconSample icon="pointing left"/>
            <c.IconSample icon="pointing right"/>
            <c.IconSample icon="pointing up"/>
            <c.IconSample icon="pound"/>
            <c.IconSample icon="power"/>
            <c.IconSample icon="print"/>
            <c.IconSample icon="privacy"/>
            <c.IconSample icon="protect"/>
            <c.IconSample icon="puzzle"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="Q">
            <c.IconSample icon="qq"/>
            <c.IconSample icon="qrcode"/>
            <c.IconSample icon="quote left"/>
            <c.IconSample icon="quote right"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="R">
            <c.IconSample icon="radio"/>
            <c.IconSample icon="rain"/>
            <c.IconSample icon="random"/>
            <c.IconSample icon="rebel"/>
            <c.IconSample icon="record"/>
            <c.IconSample icon="recycle"/>
            <c.IconSample icon="reddit square"/>
            <c.IconSample icon="reddit"/>
            <c.IconSample icon="refresh"/>
            <c.IconSample icon="remove bookmark"/>
            <c.IconSample icon="remove circle outline"/>
            <c.IconSample icon="remove circle"/>
            <c.IconSample icon="remove user"/>
            <c.IconSample icon="remove"/>
            <c.IconSample icon="renren"/>
            <c.IconSample icon="repeat"/>
            <c.IconSample icon="reply all"/>
            <c.IconSample icon="reply"/>
            <c.IconSample icon="resize horizontal"/>
            <c.IconSample icon="resize vertical"/>
            <c.IconSample icon="retweet"/>
            <c.IconSample icon="road"/>
            <c.IconSample icon="rocket"/>
            <c.IconSample icon="rss square"/>
            <c.IconSample icon="rss"/>
            <c.IconSample icon="ruble"/>
            <c.IconSample icon="rupee"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="S">
            <c.IconSample icon="save"/>
            <c.IconSample icon="search"/>
            <c.IconSample icon="selected radio"/>
            <c.IconSample icon="sellsy"/>
            <c.IconSample icon="send outline"/>
            <c.IconSample icon="send"/>
            <c.IconSample icon="server"/>
            <c.IconSample icon="setting"/>
            <c.IconSample icon="settings"/>
            <c.IconSample icon="share alternate square"/>
            <c.IconSample icon="share alternate"/>
            <c.IconSample icon="share square"/>
            <c.IconSample icon="share"/>
            <c.IconSample icon="shekel"/>
            <c.IconSample icon="shipping"/>
            <c.IconSample icon="shirtsinbulk"/>
            <c.IconSample icon="shop"/>
            <c.IconSample icon="sidebar"/>
            <c.IconSample icon="sign in"/>
            <c.IconSample icon="sign out"/>
            <c.IconSample icon="signal"/>
            <c.IconSample icon="simplybuilt"/>
            <c.IconSample icon="sitemap"/>
            <c.IconSample icon="skyatlas"/>
            <c.IconSample icon="skype"/>
            <c.IconSample icon="slack"/>
            <c.IconSample icon="slideshare"/>
            <c.IconSample icon="smile"/>
            <c.IconSample icon="soccer"/>
            <c.IconSample icon="sort alphabet ascending"/>
            <c.IconSample icon="sort alphabet descending"/>
            <c.IconSample icon="sort ascending"/>
            <c.IconSample icon="sort content ascending"/>
            <c.IconSample icon="sort content descending"/>
            <c.IconSample icon="sort descending"/>
            <c.IconSample icon="sort numeric ascending"/>
            <c.IconSample icon="sort numeric descending"/>
            <c.IconSample icon="sort"/>
            <c.IconSample icon="sound"/>
            <c.IconSample icon="soundcloud"/>
            <c.IconSample icon="space shuttle"/>
            <c.IconSample icon="spinner"/>
            <c.IconSample icon="spoon"/>
            <c.IconSample icon="spotify"/>
            <c.IconSample icon="spy"/>
            <c.IconSample icon="square outline"/>
            <c.IconSample icon="square"/>
            <c.IconSample icon="stack exchange"/>
            <c.IconSample icon="stack overflow"/>
            <c.IconSample icon="star half empty"/>
            <c.IconSample icon="star half"/>
            <c.IconSample icon="star"/>
            <c.IconSample icon="steam square"/>
            <c.IconSample icon="steam"/>
            <c.IconSample icon="step backward"/>
            <c.IconSample icon="step forward"/>
            <c.IconSample icon="stop"/>
            <c.IconSample icon="strikethrough"/>
            <c.IconSample icon="stripe"/>
            <c.IconSample icon="student"/>
            <c.IconSample icon="stumbleupon circle"/>
            <c.IconSample icon="stumbleupon"/>
            <c.IconSample icon="subscript"/>
            <c.IconSample icon="suitcase"/>
            <c.IconSample icon="sun"/>
            <c.IconSample icon="superscript"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="T">
            <c.IconSample icon="table"/>
            <c.IconSample icon="tablet"/>
            <c.IconSample icon="tag"/>
            <c.IconSample icon="tags"/>
            <c.IconSample icon="tasks"/>
            <c.IconSample icon="taxi"/>
            <c.IconSample icon="tencent weibo"/>
            <c.IconSample icon="terminal"/>
            <c.IconSample icon="text height"/>
            <c.IconSample icon="text telephone"/>
            <c.IconSample icon="text width"/>
            <c.IconSample icon="theme"/>
            <c.IconSample icon="thumbs down"/>
            <c.IconSample icon="thumbs outline down"/>
            <c.IconSample icon="thumbs outline up"/>
            <c.IconSample icon="thumbs up"/>
            <c.IconSample icon="ticket"/>
            <c.IconSample icon="toggle down"/>
            <c.IconSample icon="toggle left"/>
            <c.IconSample icon="toggle off"/>
            <c.IconSample icon="toggle on"/>
            <c.IconSample icon="toggle right"/>
            <c.IconSample icon="toggle up"/>
            <c.IconSample icon="transgender"/>
            <c.IconSample icon="translate"/>
            <c.IconSample icon="trash outline"/>
            <c.IconSample icon="trash"/>
            <c.IconSample icon="travel"/>
            <c.IconSample icon="treatment"/>
            <c.IconSample icon="tree"/>
            <c.IconSample icon="trello"/>
            <c.IconSample icon="trophy"/>
            <c.IconSample icon="tumblr square"/>
            <c.IconSample icon="tumblr"/>
            <c.IconSample icon="twitch"/>
            <c.IconSample icon="twitter square"/>
            <c.IconSample icon="twitter"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="U">
            <c.IconSample icon="underline"/>
            <c.IconSample icon="undo"/>
            <c.IconSample icon="unhide"/>
            <c.IconSample icon="university"/>
            <c.IconSample icon="unlink"/>
            <c.IconSample icon="unlock alternate"/>
            <c.IconSample icon="unlock"/>
            <c.IconSample icon="unmute"/>
            <c.IconSample icon="unordered list"/>
            <c.IconSample icon="upload"/>
            <c.IconSample icon="user"/>
            <c.IconSample icon="users"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="V">
            <c.IconSample icon="viacoin"/>
            <c.IconSample icon="video play outline"/>
            <c.IconSample icon="video play"/>
            <c.IconSample icon="vimeo"/>
            <c.IconSample icon="vine"/>
            <c.IconSample icon="visa"/>
            <c.IconSample icon="vk"/>
            <c.IconSample icon="volume down"/>
            <c.IconSample icon="volume off"/>
            <c.IconSample icon="volume up"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="W">
            <c.IconSample icon="wait"/>
            <c.IconSample icon="warning circle"/>
            <c.IconSample icon="warning sign"/>
            <c.IconSample icon="warning"/>
            <c.IconSample icon="wechat"/>
            <c.IconSample icon="weibo"/>
            <c.IconSample icon="whatsapp"/>
            <c.IconSample icon="wifi"/>
            <c.IconSample icon="windows"/>
            <c.IconSample icon="wizard"/>
            <c.IconSample icon="woman"/>
            <c.IconSample icon="won"/>
            <c.IconSample icon="wordpress"/>
            <c.IconSample icon="world"/>
            <c.IconSample icon="write square"/>
            <c.IconSample icon="write"/>
            <c.IconSample icon="xing square"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="X">
            <c.IconSample icon="xing"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="Y">
            <c.IconSample icon="yahoo"/>
            <c.IconSample icon="yelp"/>
            <c.IconSample icon="yen"/>
            <c.IconSample icon="youtube play"/>
            <c.IconSample icon="youtube square"/>
            <c.IconSample icon="youtube"/>
          </c.PageSection>

          <c.PageSection appearance="doubling six column grid" title="Z">
            <c.IconSample icon="zoom out"/>
            <c.IconSample icon="zoom"/>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
