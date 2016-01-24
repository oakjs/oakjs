"use strict";
import React from "react";
import { Card } from "oak";

export default class FlagCard extends Card {
  static defaultProps = {
    id: "Flag",
    title: "Flag"
  }
  render() {
    const c = this.components;
    return (
      <div {...this.renderProps}>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Flag">
            A flag is is used to represent a political state.
          </c.PageTitle>

          <c.Segment appearance="basic text container">
            <table className="ui compact celled striped definition table">
              <thead>
                <tr>
                  <th className="one wide">Flag</th>
                  <th>Name</th>
                  <th>ISO Code</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><c.Flag country="af"/></td><td>Afghanistan</td><td>af</td></tr>
                <tr><td><c.Flag country="ax"/></td><td>Aland Islands</td><td>ax</td></tr>
                <tr><td><c.Flag country="al"/></td><td>Albania</td><td>al</td></tr>
                <tr><td><c.Flag country="dz"/></td><td>Algeria</td><td>dz</td></tr>
                <tr><td><c.Flag country="as"/></td><td>American Samoa</td><td>as</td></tr>
                <tr><td><c.Flag country="ad"/></td><td>Andorra</td><td>ad</td></tr>
                <tr><td><c.Flag country="ao"/></td><td>Angola</td><td>ao</td></tr>
                <tr><td><c.Flag country="ai"/></td><td>Anguilla</td><td>ai</td></tr>
                <tr><td><c.Flag country="ag"/></td><td>Antigua</td><td>ag</td></tr>
                <tr><td><c.Flag country="ar"/></td><td>Argentina</td><td>ar</td></tr>
                <tr><td><c.Flag country="am"/></td><td>Armenia</td><td>am</td></tr>
                <tr><td><c.Flag country="aw"/></td><td>Aruba</td><td>aw</td></tr>
                <tr><td><c.Flag country="au"/></td><td>Australia</td><td>au</td></tr>
                <tr><td><c.Flag country="at"/></td><td>Austria</td><td>at</td></tr>
                <tr><td><c.Flag country="az"/></td><td>Azerbaijan</td><td>az</td></tr>
                <tr><td><c.Flag country="bs"/></td><td>Bahamas</td><td>bs</td></tr>
                <tr><td><c.Flag country="bh"/></td><td>Bahrain</td><td>bh</td></tr>
                <tr><td><c.Flag country="bd"/></td><td>Bangladesh</td><td>bd</td></tr>
                <tr><td><c.Flag country="bb"/></td><td>Barbados</td><td>bb</td></tr>
                <tr><td><c.Flag country="by"/></td><td>Belarus</td><td>by</td></tr>
                <tr><td><c.Flag country="be"/></td><td>Belgium</td><td>be</td></tr>
                <tr><td><c.Flag country="bz"/></td><td>Belize</td><td>bz</td></tr>
                <tr><td><c.Flag country="bj"/></td><td>Benin</td><td>bj</td></tr>
                <tr><td><c.Flag country="bm"/></td><td>Bermuda</td><td>bm</td></tr>
                <tr><td><c.Flag country="bt"/></td><td>Bhutan</td><td>bt</td></tr>
                <tr><td><c.Flag country="bo"/></td><td>Bolivia</td><td>bo</td></tr>
                <tr><td><c.Flag country="ba"/></td><td>Bosnia</td><td>ba</td></tr>
                <tr><td><c.Flag country="bw"/></td><td>Botswana</td><td>bw</td></tr>
                <tr><td><c.Flag country="bv"/></td><td>Bouvet Island</td><td>bv</td></tr>
                <tr><td><c.Flag country="br"/></td><td>Brazil</td><td>br</td></tr>
                <tr><td><c.Flag country="vg"/></td><td>British Virgin Islands</td><td>vg</td></tr>
                <tr><td><c.Flag country="bn"/></td><td>Brunei</td><td>bn</td></tr>
                <tr><td><c.Flag country="bg"/></td><td>Bulgaria</td><td>bg</td></tr>
                <tr><td><c.Flag country="bf"/></td><td>Burkina Faso</td><td>bf</td></tr>
                <tr><td><c.Flag country="ar"/></td><td>Burma</td><td>ar</td></tr>
                <tr><td><c.Flag country="bi"/></td><td>Burundi</td><td>bi</td></tr>
                <tr><td><c.Flag country="tc"/></td><td>Caicos Islands</td><td>tc</td></tr>
                <tr><td><c.Flag country="kh"/></td><td>Cambodia</td><td>kh</td></tr>
                <tr><td><c.Flag country="cm"/></td><td>Cameroon</td><td>cm</td></tr>
                <tr><td><c.Flag country="ca"/></td><td>Canada</td><td>ca</td></tr>
                <tr><td><c.Flag country="cv"/></td><td>Cape Verde</td><td>cv</td></tr>
                <tr><td><c.Flag country="ky"/></td><td>Cayman Islands</td><td>ky</td></tr>
                <tr><td><c.Flag country="cf"/></td><td>Central African Republic</td><td>cf</td></tr>
                <tr><td><c.Flag country="td"/></td><td>Chad</td><td>td</td></tr>
                <tr><td><c.Flag country="cl"/></td><td>Chile</td><td>cl</td></tr>
                <tr><td><c.Flag country="cn"/></td><td>China</td><td>cn</td></tr>
                <tr><td><c.Flag country="cx"/></td><td>Christmas Island</td><td>cx</td></tr>
                <tr><td><c.Flag country="cc"/></td><td>Cocos Islands</td><td>cc</td></tr>
                <tr><td><c.Flag country="co"/></td><td>Colombia</td><td>co</td></tr>
                <tr><td><c.Flag country="km"/></td><td>Comoros</td><td>km</td></tr>
                <tr><td><c.Flag country="cg"/></td><td>Congo Brazzaville</td><td>cg</td></tr>
                <tr><td><c.Flag country="cd"/></td><td>Congo</td><td>cd</td></tr>
                <tr><td><c.Flag country="ck"/></td><td>Cook Islands</td><td>ck</td></tr>
                <tr><td><c.Flag country="cr"/></td><td>Costa Rica</td><td>cr</td></tr>
                <tr><td><c.Flag country="ci"/></td><td>Cote Divoire</td><td>ci</td></tr>
                <tr><td><c.Flag country="hr"/></td><td>Croatia</td><td>hr</td></tr>
                <tr><td><c.Flag country="cu"/></td><td>Cuba</td><td>cu</td></tr>
                <tr><td><c.Flag country="cy"/></td><td>Cyprus</td><td>cy</td></tr>
                <tr><td><c.Flag country="cz"/></td><td>Czech Republic</td><td>cz</td></tr>
                <tr><td><c.Flag country="dk"/></td><td>Denmark</td><td>dk</td></tr>
                <tr><td><c.Flag country="dj"/></td><td>Djibouti</td><td>dj</td></tr>
                <tr><td><c.Flag country="dm"/></td><td>Dominica</td><td>dm</td></tr>
                <tr><td><c.Flag country="do"/></td><td>Dominican Republic</td><td>do</td></tr>
                <tr><td><c.Flag country="ec"/></td><td>Ecuador</td><td>ec</td></tr>
                <tr><td><c.Flag country="eg"/></td><td>Egypt</td><td>eg</td></tr>
                <tr><td><c.Flag country="sv"/></td><td>El Salvador</td><td>sv</td></tr>
                <tr><td><c.Flag country="gb"/></td><td>England</td><td>gb</td></tr>
                <tr><td><c.Flag country="gq"/></td><td>Equatorial Guinea</td><td>gq</td></tr>
                <tr><td><c.Flag country="er"/></td><td>Eritrea</td><td>er</td></tr>
                <tr><td><c.Flag country="ee"/></td><td>Estonia</td><td>ee</td></tr>
                <tr><td><c.Flag country="et"/></td><td>Ethiopia</td><td>et</td></tr>
                <tr><td><c.Flag country="eu"/></td><td>European Union</td><td>eu</td></tr>
                <tr><td><c.Flag country="fk"/></td><td>Falkland Islands</td><td>fk</td></tr>
                <tr><td><c.Flag country="fo"/></td><td>Faroe Islands</td><td>fo</td></tr>
                <tr><td><c.Flag country="fj"/></td><td>Fiji</td><td>fj</td></tr>
                <tr><td><c.Flag country="fi"/></td><td>Finland</td><td>fi</td></tr>
                <tr><td><c.Flag country="fr"/></td><td>France</td><td>fr</td></tr>
                <tr><td><c.Flag country="gf"/></td><td>French Guiana</td><td>gf</td></tr>
                <tr><td><c.Flag country="pf"/></td><td>French Polynesia</td><td>pf</td></tr>
                <tr><td><c.Flag country="tf"/></td><td>French Territories</td><td>tf</td></tr>
                <tr><td><c.Flag country="ga"/></td><td>Gabon</td><td>ga</td></tr>
                <tr><td><c.Flag country="gm"/></td><td>Gambia</td><td>gm</td></tr>
                <tr><td><c.Flag country="ge"/></td><td>Georgia</td><td>ge</td></tr>
                <tr><td><c.Flag country="de"/></td><td>Germany</td><td>de</td></tr>
                <tr><td><c.Flag country="gh"/></td><td>Ghana</td><td>gh</td></tr>
                <tr><td><c.Flag country="gi"/></td><td>Gibraltar</td><td>gi</td></tr>
                <tr><td><c.Flag country="gr"/></td><td>Greece</td><td>gr</td></tr>
                <tr><td><c.Flag country="gl"/></td><td>Greenland</td><td>gl</td></tr>
                <tr><td><c.Flag country="gd"/></td><td>Grenada</td><td>gd</td></tr>
                <tr><td><c.Flag country="gp"/></td><td>Guadeloupe</td><td>gp</td></tr>
                <tr><td><c.Flag country="gu"/></td><td>Guam</td><td>gu</td></tr>
                <tr><td><c.Flag country="gt"/></td><td>Guatemala</td><td>gt</td></tr>
                <tr><td><c.Flag country="gw"/></td><td>Guinea-Bissau</td><td>gw</td></tr>
                <tr><td><c.Flag country="gn"/></td><td>Guinea</td><td>gn</td></tr>
                <tr><td><c.Flag country="gy"/></td><td>Guyana</td><td>gy</td></tr>
                <tr><td><c.Flag country="ht"/></td><td>Haiti</td><td>ht</td></tr>
                <tr><td><c.Flag country="hm"/></td><td>Heard Island</td><td>hm</td></tr>
                <tr><td><c.Flag country="hn"/></td><td>Honduras</td><td>hn</td></tr>
                <tr><td><c.Flag country="hk"/></td><td>Hong Kong</td><td>hk</td></tr>
                <tr><td><c.Flag country="hu"/></td><td>Hungary</td><td>hu</td></tr>
                <tr><td><c.Flag country="is"/></td><td>Iceland</td><td>is</td></tr>
                <tr><td><c.Flag country="in"/></td><td>India</td><td>in</td></tr>
                <tr><td><c.Flag country="io"/></td><td>Indian Ocean Territory</td><td>io</td></tr>
                <tr><td><c.Flag country="id"/></td><td>Indonesia</td><td>id</td></tr>
                <tr><td><c.Flag country="ir"/></td><td>Iran</td><td>ir</td></tr>
                <tr><td><c.Flag country="iq"/></td><td>Iraq</td><td>iq</td></tr>
                <tr><td><c.Flag country="ie"/></td><td>Ireland</td><td>ie</td></tr>
                <tr><td><c.Flag country="il"/></td><td>Israel</td><td>il</td></tr>
                <tr><td><c.Flag country="it"/></td><td>Italy</td><td>it</td></tr>
                <tr><td><c.Flag country="jm"/></td><td>Jamaica</td><td>jm</td></tr>
                <tr><td><c.Flag country="jp"/></td><td>Japan</td><td>jp</td></tr>
                <tr><td><c.Flag country="jo"/></td><td>Jordan</td><td>jo</td></tr>
                <tr><td><c.Flag country="kz"/></td><td>Kazakhstan</td><td>kz</td></tr>
                <tr><td><c.Flag country="ke"/></td><td>Kenya</td><td>ke</td></tr>
                <tr><td><c.Flag country="ki"/></td><td>Kiribati</td><td>ki</td></tr>
                <tr><td><c.Flag country="kw"/></td><td>Kuwait</td><td>kw</td></tr>
                <tr><td><c.Flag country="kg"/></td><td>Kyrgyzstan</td><td>kg</td></tr>
                <tr><td><c.Flag country="la"/></td><td>Laos</td><td>la</td></tr>
                <tr><td><c.Flag country="lv"/></td><td>Latvia</td><td>lv</td></tr>
                <tr><td><c.Flag country="lb"/></td><td>Lebanon</td><td>lb</td></tr>
                <tr><td><c.Flag country="ls"/></td><td>Lesotho</td><td>ls</td></tr>
                <tr><td><c.Flag country="lr"/></td><td>Liberia</td><td>lr</td></tr>
                <tr><td><c.Flag country="ly"/></td><td>Libya</td><td>ly</td></tr>
                <tr><td><c.Flag country="li"/></td><td>Liechtenstein</td><td>li</td></tr>
                <tr><td><c.Flag country="lt"/></td><td>Lithuania</td><td>lt</td></tr>
                <tr><td><c.Flag country="lu"/></td><td>Luxembourg</td><td>lu</td></tr>
                <tr><td><c.Flag country="mo"/></td><td>Macau</td><td>mo</td></tr>
                <tr><td><c.Flag country="mk"/></td><td>Macedonia</td><td>mk</td></tr>
                <tr><td><c.Flag country="mg"/></td><td>Madagascar</td><td>mg</td></tr>
                <tr><td><c.Flag country="mw"/></td><td>Malawi</td><td>mw</td></tr>
                <tr><td><c.Flag country="my"/></td><td>Malaysia</td><td>my</td></tr>
                <tr><td><c.Flag country="mv"/></td><td>Maldives</td><td>mv</td></tr>
                <tr><td><c.Flag country="ml"/></td><td>Mali</td><td>ml</td></tr>
                <tr><td><c.Flag country="mt"/></td><td>Malta</td><td>mt</td></tr>
                <tr><td><c.Flag country="mh"/></td><td>Marshall Islands</td><td>mh</td></tr>
                <tr><td><c.Flag country="mq"/></td><td>Martinique</td><td>mq</td></tr>
                <tr><td><c.Flag country="mr"/></td><td>Mauritania</td><td>mr</td></tr>
                <tr><td><c.Flag country="mu"/></td><td>Mauritius</td><td>mu</td></tr>
                <tr><td><c.Flag country="yt"/></td><td>Mayotte</td><td>yt</td></tr>
                <tr><td><c.Flag country="mx"/></td><td>Mexico</td><td>mx</td></tr>
                <tr><td><c.Flag country="fm"/></td><td>Micronesia</td><td>fm</td></tr>
                <tr><td><c.Flag country="md"/></td><td>Moldova</td><td>md</td></tr>
                <tr><td><c.Flag country="mc"/></td><td>Monaco</td><td>mc</td></tr>
                <tr><td><c.Flag country="mn"/></td><td>Mongolia</td><td>mn</td></tr>
                <tr><td><c.Flag country="me"/></td><td>Montenegro</td><td>me</td></tr>
                <tr><td><c.Flag country="ms"/></td><td>Montserrat</td><td>ms</td></tr>
                <tr><td><c.Flag country="ma"/></td><td>Morocco</td><td>ma</td></tr>
                <tr><td><c.Flag country="mz"/></td><td>Mozambique</td><td>mz</td></tr>
                <tr><td><c.Flag country="na"/></td><td>Namibia</td><td>na</td></tr>
                <tr><td><c.Flag country="nr"/></td><td>Nauru</td><td>nr</td></tr>
                <tr><td><c.Flag country="np"/></td><td>Nepal</td><td>np</td></tr>
                <tr><td><c.Flag country="an"/></td><td>Netherlands Antilles</td><td>an</td></tr>
                <tr><td><c.Flag country="nl"/></td><td>Netherlands</td><td>nl</td></tr>
                <tr><td><c.Flag country="nc"/></td><td>New Caledonia</td><td>nc</td></tr>
                <tr><td><c.Flag country="pg"/></td><td>New Guinea</td><td>pg</td></tr>
                <tr><td><c.Flag country="nz"/></td><td>New Zealand</td><td>nz</td></tr>
                <tr><td><c.Flag country="ni"/></td><td>Nicaragua</td><td>ni</td></tr>
                <tr><td><c.Flag country="ne"/></td><td>Niger</td><td>ne</td></tr>
                <tr><td><c.Flag country="ng"/></td><td>Nigeria</td><td>ng</td></tr>
                <tr><td><c.Flag country="nu"/></td><td>Niue</td><td>nu</td></tr>
                <tr><td><c.Flag country="nf"/></td><td>Norfolk Island</td><td>nf</td></tr>
                <tr><td><c.Flag country="kp"/></td><td>North Korea</td><td>kp</td></tr>
                <tr><td><c.Flag country="mp"/></td><td>Northern Mariana Islands</td><td>mp</td></tr>
                <tr><td><c.Flag country="no"/></td><td>Norway</td><td>no</td></tr>
                <tr><td><c.Flag country="om"/></td><td>Oman</td><td>om</td></tr>
                <tr><td><c.Flag country="pk"/></td><td>Pakistan</td><td>pk</td></tr>
                <tr><td><c.Flag country="pw"/></td><td>Palau</td><td>pw</td></tr>
                <tr><td><c.Flag country="ps"/></td><td>Palestine</td><td>ps</td></tr>
                <tr><td><c.Flag country="pa"/></td><td>Panama</td><td>pa</td></tr>
                <tr><td><c.Flag country="py"/></td><td>Paraguay</td><td>py</td></tr>
                <tr><td><c.Flag country="pe"/></td><td>Peru</td><td>pe</td></tr>
                <tr><td><c.Flag country="ph"/></td><td>Philippines</td><td>ph</td></tr>
                <tr><td><c.Flag country="pn"/></td><td>Pitcairn Islands</td><td>pn</td></tr>
                <tr><td><c.Flag country="pl"/></td><td>Poland</td><td>pl</td></tr>
                <tr><td><c.Flag country="pt"/></td><td>Portugal</td><td>pt</td></tr>
                <tr><td><c.Flag country="pr"/></td><td>Puerto Rico</td><td>pr</td></tr>
                <tr><td><c.Flag country="qa"/></td><td>Qatar</td><td>qa</td></tr>
                <tr><td><c.Flag country="re"/></td><td>Reunion</td><td>re</td></tr>
                <tr><td><c.Flag country="ro"/></td><td>Romania</td><td>ro</td></tr>
                <tr><td><c.Flag country="ru"/></td><td>Russia</td><td>ru</td></tr>
                <tr><td><c.Flag country="rw"/></td><td>Rwanda</td><td>rw</td></tr>
                <tr><td><c.Flag country="sh"/></td><td>Saint Helena</td><td>sh</td></tr>
                <tr><td><c.Flag country="kn"/></td><td>Saint Kitts and Nevis</td><td>kn</td></tr>
                <tr><td><c.Flag country="lc"/></td><td>Saint Lucia</td><td>lc</td></tr>
                <tr><td><c.Flag country="pm"/></td><td>Saint Pierre</td><td>pm</td></tr>
                <tr><td><c.Flag country="vc"/></td><td>Saint Vincent</td><td>vc</td></tr>
                <tr><td><c.Flag country="ws"/></td><td>Samoa</td><td>ws</td></tr>
                <tr><td><c.Flag country="sm"/></td><td>San Marino</td><td>sm</td></tr>
                <tr><td><c.Flag country="gs"/></td><td>Sandwich Islands</td><td>gs</td></tr>
                <tr><td><c.Flag country="st"/></td><td>Sao Tome</td><td>st</td></tr>
                <tr><td><c.Flag country="sa"/></td><td>Saudi Arabia</td><td>sa</td></tr>
                <tr><td><c.Flag country="sn"/></td><td>Senegal</td><td>sn</td></tr>
                <tr><td><c.Flag country="cs"/></td><td>Serbia</td><td>cs</td></tr>
                <tr><td><c.Flag country="rs"/></td><td>Serbia</td><td>rs</td></tr>
                <tr><td><c.Flag country="sc"/></td><td>Seychelles</td><td>sc</td></tr>
                <tr><td><c.Flag country="sl"/></td><td>Sierra Leone</td><td>sl</td></tr>
                <tr><td><c.Flag country="sg"/></td><td>Singapore</td><td>sg</td></tr>
                <tr><td><c.Flag country="sk"/></td><td>Slovakia</td><td>sk</td></tr>
                <tr><td><c.Flag country="si"/></td><td>Slovenia</td><td>si</td></tr>
                <tr><td><c.Flag country="sb"/></td><td>Solomon Islands</td><td>sb</td></tr>
                <tr><td><c.Flag country="so"/></td><td>Somalia</td><td>so</td></tr>
                <tr><td><c.Flag country="za"/></td><td>South Africa</td><td>za</td></tr>
                <tr><td><c.Flag country="kr"/></td><td>South Korea</td><td>kr</td></tr>
                <tr><td><c.Flag country="es"/></td><td>Spain</td><td>es</td></tr>
                <tr><td><c.Flag country="lk"/></td><td>Sri Lanka</td><td>lk</td></tr>
                <tr><td><c.Flag country="sd"/></td><td>Sudan</td><td>sd</td></tr>
                <tr><td><c.Flag country="sr"/></td><td>Suriname</td><td>sr</td></tr>
                <tr><td><c.Flag country="sj"/></td><td>Svalbard</td><td>sj</td></tr>
                <tr><td><c.Flag country="sz"/></td><td>Swaziland</td><td>sz</td></tr>
                <tr><td><c.Flag country="se"/></td><td>Sweden</td><td>se</td></tr>
                <tr><td><c.Flag country="ch"/></td><td>Switzerland</td><td>ch</td></tr>
                <tr><td><c.Flag country="sy"/></td><td>Syria</td><td>sy</td></tr>
                <tr><td><c.Flag country="tw"/></td><td>Taiwan</td><td>tw</td></tr>
                <tr><td><c.Flag country="tj"/></td><td>Tajikistan</td><td>tj</td></tr>
                <tr><td><c.Flag country="tz"/></td><td>Tanzania</td><td>tz</td></tr>
                <tr><td><c.Flag country="th"/></td><td>Thailand</td><td>th</td></tr>
                <tr><td><c.Flag country="tl"/></td><td>Timorleste</td><td>tl</td></tr>
                <tr><td><c.Flag country="tg"/></td><td>Togo</td><td>tg</td></tr>
                <tr><td><c.Flag country="tk"/></td><td>Tokelau</td><td>tk</td></tr>
                <tr><td><c.Flag country="to"/></td><td>Tonga</td><td>to</td></tr>
                <tr><td><c.Flag country="tt"/></td><td>Trinidad</td><td>tt</td></tr>
                <tr><td><c.Flag country="tn"/></td><td>Tunisia</td><td>tn</td></tr>
                <tr><td><c.Flag country="tr"/></td><td>Turkey</td><td>tr</td></tr>
                <tr><td><c.Flag country="tm"/></td><td>Turkmenistan</td><td>tm</td></tr>
                <tr><td><c.Flag country="tv"/></td><td>Tuvalu</td><td>tv</td></tr>
                <tr><td><c.Flag country="ug"/></td><td>Uganda</td><td>ug</td></tr>
                <tr><td><c.Flag country="ua"/></td><td>Ukraine</td><td>ua</td></tr>
                <tr><td><c.Flag country="ae"/></td><td>United Arab Emirates</td><td>ae</td></tr>
                <tr><td><c.Flag country="us"/></td><td>United States</td><td>us</td></tr>
                <tr><td><c.Flag country="uy"/></td><td>Uruguay</td><td>uy</td></tr>
                <tr><td><c.Flag country="um"/></td><td>Us Minor Islands</td><td>um</td></tr>
                <tr><td><c.Flag country="vi"/></td><td>Us Virgin Islands</td><td>vi</td></tr>
                <tr><td><c.Flag country="uz"/></td><td>Uzbekistan</td><td>uz</td></tr>
                <tr><td><c.Flag country="vu"/></td><td>Vanuatu</td><td>vu</td></tr>
                <tr><td><c.Flag country="va"/></td><td>Vatican City</td><td>va</td></tr>
                <tr><td><c.Flag country="ve"/></td><td>Venezuela</td><td>ve</td></tr>
                <tr><td><c.Flag country="vn"/></td><td>Vietnam</td><td>vn</td></tr>
                <tr><td><c.Flag country="wf"/></td><td>Wallis and Futuna</td><td>wf</td></tr>
                <tr><td><c.Flag country="eh"/></td><td>Western Sahara</td><td>eh</td></tr>
                <tr><td><c.Flag country="ye"/></td><td>Yemen</td><td>ye</td></tr>
                <tr><td><c.Flag country="zm"/></td><td>Zambia</td><td>zm</td></tr>
                <tr><td><c.Flag country="zw"/></td><td>Zimbabwe</td><td>zw</td></tr>
              </tbody>
            </table>

          </c.Segment>

        </c.Page>
      </div>
    );
  }
}
