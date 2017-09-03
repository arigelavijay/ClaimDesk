<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxml="urn:schemas-microsoft-com:xslt" xmlns:umbraco.library="urn:umbraco.library" exclude-result-prefixes="msxml umbraco.library">
  <xsl:output indent="yes" media-type="text/html" method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <div id="metadata" style="display: none;">
      <xsl:for-each select="Report/MetaData/Attributes/Attribute">
        <input type="hidden">
          <xsl:attribute name="id">
            <xsl:value-of select="@id" />
          </xsl:attribute>
          <xsl:attribute name="name">
            <xsl:value-of select="@id" />
          </xsl:attribute>
          <xsl:attribute name="value">
            <xsl:value-of select="@value" />
          </xsl:attribute>
        </input>
      </xsl:for-each>
    </div>

    <ul class="breadcrumbMy">
      <xsl:for-each select="Report/Wizard">
        <li class="disabledCss">
          <xsl:attribute name="id">
            <xsl:value-of select="concat('li-',@id)" />
          </xsl:attribute>
          <a role="tab" class="cursorCss" onclick="tabClick(this);">
            <xsl:attribute name="data-target">
              <xsl:value-of select="concat('#',@id)" />
            </xsl:attribute>
            <xsl:attribute name="id">
              <xsl:value-of select="concat('a-',@id)" />
            </xsl:attribute>
            <xsl:value-of select="@text" />
          </a>
        </li>
      </xsl:for-each>
    </ul>
    <div style="float: right; width: auto; float: right; width: auto; margin: -30px 0px 0 0; font-weight: bold;" class="pull-right">
      <span style="color: #2c7dc8;">Incident Id:</span>
      <span id="top_inc_id" style="color: #609;"></span>
      <span style="color: #2c7dc8;">    Claim Id:</span>
      <span id="top_claim_id" style="color: #609;"></span>
    </div>
    <div class="clear"></div>
    <div class="tab-content mycont">
      <xsl:for-each select="Report/Wizard">
        <xsl:choose>
          <xsl:when test="@id = 'contacts'">
            <div class="tab-pane spaceTab row" id="contacts">
              <form id="frm_contacts">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-9 title-claim-links"></div>
                    <div class="col-md-3">
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-contact">Add Contact</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">&#160;</div>
                  </div>
                  <div class="row">
                    <h2>Manage Contacts</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblContacts">
                        <thead class="myTabHead">
                          <tr>
                            <th class="talign">Name</th>
                            <th class="talign">Contact Type</th>
                            <th class="talign">Address</th>
                            <th class="talign">Phone</th>
                            <th class="talign">Email</th>
                            <th class="talign">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_contacts"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'attatchments'">
            <div class="tab-pane spaceTab row" id="attatchments">
              <p class="bodyTextBig">You can upload any documents related to this claim. Click "Browse" to select and upload file(s).</p>
              <form id="frm_attatchments">
                <div class="claimForm">
                  <div class="formInci1 noMar">
                    <input name="upfile" id="upfile" type="file" class="planeTextFild" />
                  </div>
                  <div class="formInciBigBt">
                    <input name="upload1" id="upload1" type="button" value="Upload File" class="buttonNext" onclick="upload_wc_file('file')" />
                  </div>
                  <div class="clear"></div>
                </div>
                <img id="pr_img" src="images/loading9.gif" style="margin-left: 35%; display: none; top: 20%; position: absolute; z-index: 3000;" />
              </form>
              <div class="uploadBox">
                <p class="uploadHead">Files</p>
                <table class="fullwidth" id='receiptlist'>
                  <tr class="green">
                    <td style="width: 8%;"></td>
                    <td style="width: 92%;" class="tlalign whitebg">You haven't uploaded any attachments!</td>
                  </tr>
                </table>
              </div>
              <br/>
              <div id="nav_attatchments"></div>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'diaryNotes'">
            <div class="tab-pane spaceTab row" id="diaryNotes">
              <form id="frm_diaryNotes">
                <style type="text/css">
                  #txt_DiaryNotes-error.error {
                  margin-top: -17px;
                  }

                  #ddl_Category-error.error {
                  margin-top: -17px;
                  }

                  #txt_FollowUp_Desc-error.error {
                  margin-top: -19px;
                  }
                  #txt_FollowUp_Date-error.error {
                  margin-top: -19px;
                  }
                  span.errMsgLbl label {
                  margin-top: -19px;
                  }
                </style>
                <div id="createWc">
                  <div class="col-md-11"></div>
                  <div class="col-md-1">
                    <input type="button" class="buttonNext rightAlign" value="Add Note" onclick="btn_AddNote_OnClick(-1);" />
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12">&#160;</div>
                </div>
                <div class="row">
                  <div class="col-xs-12">
                    <div id="claim_button" class="pull-right"></div>
                  </div>
                  <div class="col-xs-12" id="div_tbl">
                    <div class="col-xs-5"></div>
                    <div class="col-xs-2">
                      <b>No Diary Notes Exist</b>
                    </div>
                    <div class="col-xs-5"></div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12">&#160;</div>
                </div>
                <div id="nav_diaryNotes">
                </div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'financials'">
            <div class="tab-pane spaceTab row" id="financials">
              <form id="frm_financials">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-9 title-claim-links">Financials</div>
                    <div class="col-md-3">
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-reserve">Add Reserve</button>
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-payment">Add Payment</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6">
                      <table class="table">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Payments</th>
                            <th>Total Outstanding</th>
                            <th>Total Incurred</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Expenses</td>
                            <td>$ 150.00</td>
                            <td>$ 50.00</td>
                            <td>$ 200.00</td>
                          </tr>
                          <tr>
                            <td>Indemnity</td>
                            <td>$ 0.00</td>
                            <td>$ 200.00</td>
                            <td>$ 200.00</td>
                          </tr>
                          <tr>
                            <td>Medical</td>
                            <td>$ 500.00</td>
                            <td>$ 0.00</td>
                            <td>$ 500.00</td>
                          </tr>
                          <tr>
                            <td>Recovery</td>
                            <td>$ 200.00</td>
                            <td></td>
                            <td>- $ 200.00</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr style="border-top:1px solid black;">
                            <td>Totals</td>
                            <td>$ 450.00</td>
                            <td>$ 250.00</td>
                            <td>$ 700.00</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <div class="col-md-3"></div>
                  </div>
                  <div class="row">
                    <h2>Reserves</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblReserves">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reserve Type</th>
                            <th>Accounting Code</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>6/01/15</td>
                            <td>General Expense Reserve</td>
                            <td>353453534</td>
                            <td>$ 100.00</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>6/01/15</td>
                            <td>General Intemnity Reserve</td>
                            <td></td>
                            <td>$ 200.00</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>6/01/15</td>
                            <td>General Medical Reserve</td>
                            <td>353453534</td>
                            <td>$ 300.00</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>6/10/15</td>
                            <td>General Expense Reserve</td>
                            <td></td>
                            <td>$ 100.00</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>6/12/15</td>
                            <td>General Medical Reserve</td>
                            <td>353453534</td>
                            <td>$ 200.00</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="row">
                    <h2>Payments</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblPayments">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Service Dates</th>
                            <th>Payment Type</th>
                            <th>Payee</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>6/03/15</td>
                            <td>06/3/15 - 6/3/15</td>
                            <td>General Medical Pay Code</td>
                            <td>Dr. Phil</td>
                            <td>$ 500.00</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>6/05/15</td>
                            <td>5/1/15 - 6/5/15</td>
                            <td>General Expense Pay Code</td>
                            <td>Broadpsire</td>
                            <td>$ 150.00</td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>6/10/15</td>
                            <td>06/3/15 - 6/3/15</td>
                            <td>Medical Recovery Overpayment</td>
                            <td>Dr. Phil</td>
                            <td>$ 200.00</td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_financials"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'tasks'">
            <div class="tab-pane spaceTab row" id="tasks">
              <form id="frm_tasks">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-9 title-claim-links"></div>
                    <div class="col-md-3">
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-task" onclick="btnAddTask();">Add Task</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">&#160;</div>
                  </div>
                  <div class="row">
                    <h2>Tasks</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblTasks">
                        <thead>
                          <tr>
                            <th>Task ID</th>
                            <th>Description</th>
                            <th>Assigned To</th>
                            <th>Due Date</th>
                            <th>Task Completed</th>
                            <th>#Action</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_tasks"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'litigation'">
            <div class="tab-pane spaceTab row" id="litigation">
              <form id="frm_litigation">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-9 title-claim-links"></div>
                    <div class="col-md-3">
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-litigation" onclick="btnAddLitigation();">Add Litigation</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">&#160;</div>
                  </div>
                  <div class="row">
                    <h2>Litigation List</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblLitigation">
                        <thead>
                          <tr>
                            <th>Litigation ID</th>
                            <th>First Notice Of Representation</th>
                            <th>Date Filed</th>
                            <th>Venue Type</th>
                            <th>Case Settled</th>
                            <th>#Action</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_litigation"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'subClosure'">
            <div class="tab-pane spaceTab row" id="subClosure">
              <form id="frm_subClosure">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-9 title-claim-links"></div>
                    <div class="col-md-3">
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-subClosure" onclick="btnAddsubClosure();">Add</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xs-12">&#160;</div>
                  </div>
                  <div class="row">
                    <h2>Subrogation and Closure List</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblsubClosure">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Settlement Type</th>
                            <th>Expected Closure Date</th>
                            <th>Payout Begin Date</th>
                            <th>Payout End Date</th>
                            <th>#Action</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_subClosure"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'returnWork'">
            <div class="tab-pane spaceTab row" id="returnWork">
              <form id="frm_returnWork">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-9 title-claim-links"></div>
                    <div class="col-md-3">
                      <button type="button" class="buttonNext pull-right" data-toggle="modal" data-target=".add-activity" onclick="btnAddActivity();">Add Activity</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">Attorney Representation</div>
                    <div class="col-md-4">Weekly Wage</div>
                    <div class="col-md-4">TTD Savings Start Date</div>
                  </div>
                  <div class="row">
                    <div class="col-md-4">Assigned To</div>
                    <div class="col-md-4">Weekly Comp Rate</div>
                    <div class="col-md-4">
                      TTD Savings End Date <br />Estimated Weeks Saved
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6" style="margin-left:20px;">
                      <div class="row">
                        <b>Company</b>
                        <br />
                        <div class="row">
                          <div class="col-md-6">A1 Company</div>
                          <div class="col-md-6">Claim Specialist: Seth johnston</div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">2349 Example Street</div>
                          <div class="col-md-6">Policy Expiration Date</div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">San Mateo, CA 23948</div>
                          <div class="col-md-6">Policy Inception Date</div>
                        </div>
                        <div class="row">
                          <div class="col-md-6">www.a1company.com</div>
                          <div class="col-md-6">Company Internal ID</div>
                        </div>
                      </div>
                      <div class="row">
                        <b>Contacts</b>
                        <br />
                        <div class="row">
                          <div class="col-md-12">
                            <a>Ana Gonzalex</a>,Non Profit, Universidad Popular, 444-444-4444 <br />
                            <a>Sam Smith</a>,Non Profit, North County Homeless Shelter, 393-393-3939 <br />
                            <a>Sally Moll</a>,Employer, A1 Company, 222-222-2222 <br />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div style="display:block;float:left;">
                        <b>Category Tags</b>
                      </div><br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#880015;"></div>&nbsp;WF RTW Initial Evaluation<br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#ED1C24;"></div>&nbsp;WF Non Profit RTW  <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#FFF200;"></div>&nbsp;Job Interview <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#22B14C;"></div>&nbsp;Job Offer Extended <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#00A2E8;"></div>&nbsp;Time Card Management <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#3F48CC;"></div>&nbsp;Broardspire WOLP <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#A349A4;"></div>&nbsp;Inactive <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#B97A57;"></div>&nbsp;WF Insured RTW <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#FFAEC9;"></div>&nbsp;Prospective Broker <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#B5E61D;"></div>&nbsp;Safety <br />
                      <div style="display:block;float:left;height:15px;width:20px;background-color:#000000;"></div>&nbsp;Complete Markets <br />
                    </div>
                  </div>
                  <div class="row">
                    <h2>RETURN TO WORK</h2>
                    <div class="col-md-12">
                      <table class="table" id="tblreturnWork">
                        <thead>
                          <tr>
                            <th>Activity Type</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Created By</th>
                            <th>Description</th>
                            <th>#Action</th>
                          </tr>
                        </thead>
                        <tbody></tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_returnWork"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:when test="@id = 'lostRestDays'">
            <div class="tab-pane spaceTab row" id="lostRestDays">
              <form id="frm_lostRestDays">
                <div class="claim-links">
                  <div class="row">
                    <div class="col-md-12">
                      <h2>Lost and Restricted Days Summary</h2>
                      <table id="tblLRSummary">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Total</th>
                            <th>Actual</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                  <div class="row" style="margin-top:10px;">
                    <div class="col-md-5">
                      <h2>Lost and Restricted Days List</h2>
                    </div>
                    <div class="col-md-6">
                    </div>
                    <div class="col-md-1">
                      <button data-toggle="modal" type="button" data-target=".add-lrdays" class="buttonNext">Add</button>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <table id="tblLRList">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Lost Or Restricted Day</th>
                            <th>Date Worker Left</th>
                            <th>Date Worker Returned</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </div>
                <div id="nav_lostRestDays"></div>
              </form>
            </div>
          </xsl:when>
          <xsl:otherwise>
            <div class="tab-pane spaceTab row">
              <xsl:attribute name="id">
                <xsl:value-of select="@id"/>
              </xsl:attribute>
              <form class="frmCss" novalidate="novalidate">
                <xsl:attribute name="id">
                  <xsl:value-of select="concat('frm_',@id)"/>
                </xsl:attribute>
                <xsl:for-each select="Field">
                  <div class="col-sm-4">
                    <xsl:if test="@name != ''">
                      <label class="myLable">
                        <xsl:attribute name="for">
                          <xsl:value-of select="@name"/>
                        </xsl:attribute>
                        <xsl:value-of select="@label"/>
                      </label>
                    </xsl:if>
                    <xsl:if test="@Type='Text'">
                      <input type="text">
                        <xsl:attribute name="id">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="name">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:if test="@required != ''">
                          <xsl:attribute name="required">
                            <xsl:value-of select="@required" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@disabled != ''">
                          <xsl:attribute name="disabled">
                            <xsl:value-of select="@disabled" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@readonly != ''">
                          <xsl:attribute name="readonly">
                            <xsl:value-of select="@readonly" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="class">
                          <xsl:value-of select="@class" />
                        </xsl:attribute>
                        <xsl:if test="@onKeyUp != ''">
                          <xsl:attribute name="onKeyUp">
                            <xsl:value-of select="@onKeyUp" />
                          </xsl:attribute>
                        </xsl:if>
                      </input>
                    </xsl:if>
                    <xsl:if test="@Type='Number'">
                      <input type="number">
                        <xsl:attribute name="id">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="name">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:if test="@required != ''">
                          <xsl:attribute name="required">
                            <xsl:value-of select="@required" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@disabled != ''">
                          <xsl:attribute name="disabled">
                            <xsl:value-of select="@disabled" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@readonly != ''">
                          <xsl:attribute name="readonly">
                            <xsl:value-of select="@readonly" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@min != ''">
                          <xsl:attribute name="min">
                            <xsl:value-of select="@min" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="class">
                          <xsl:value-of select="@class" />
                        </xsl:attribute>
                      </input>
                    </xsl:if>
                    <xsl:if test="@Type='TextArea'">
                      <textarea>
                        <xsl:attribute name="id">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="name">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:if test="@required != ''">
                          <xsl:attribute name="required">
                            <xsl:value-of select="@required" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@disabled != ''">
                          <xsl:attribute name="disabled">
                            <xsl:value-of select="@disabled" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@readonly != ''">
                          <xsl:attribute name="readonly">
                            <xsl:value-of select="@readonly" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="class">
                          <xsl:value-of select="@class" />
                        </xsl:attribute>
                        <xsl:attribute name="rows">
                          <xsl:value-of select="@rows" />
                        </xsl:attribute>
                        <xsl:attribute name="cols">
                          <xsl:value-of select="@cols" />
                        </xsl:attribute>
                      </textarea>
                    </xsl:if>
                    <xsl:if test="@Type='Select'">
                      <select>
                        <xsl:attribute name="id">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="name">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:if test="@required != ''">
                          <xsl:attribute name="required">
                            <xsl:value-of select="@required" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="class">
                          <xsl:value-of select="@class" />
                        </xsl:attribute>
                        <xsl:if test="@dataurl != ''">
                          <xsl:attribute name="data-url">
                            <xsl:value-of select="@dataurl" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@dataparam != ''">
                          <xsl:attribute name="data-param">
                            <xsl:value-of select="@dataparam" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@dataparamtype != ''">
                          <xsl:attribute name="data-paramtype">
                            <xsl:value-of select="@dataparamtype" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@onchange != ''">
                          <xsl:attribute name="onchange">
                            <xsl:value-of select="@onchange" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:for-each select="items/option">
                          <option>
                            <xsl:attribute name="value">
                              <xsl:value-of select="@value" />
                            </xsl:attribute>
                            <xsl:if test="@selected != ''">
                              <xsl:attribute name="selected">
                                <xsl:value-of select="@selected" />
                              </xsl:attribute>
                            </xsl:if>
                            <xsl:value-of select="current()" />
                          </option>
                        </xsl:for-each>
                      </select>
                    </xsl:if>
                    <xsl:if test="@Type='Radio'">
                      <div class="radioCss">
                        <xsl:for-each select="radio">
                          <div class="col-sm-3">
                            <input type="radio">
                              <xsl:attribute name="id">
                                <xsl:value-of select="@data-id" />
                              </xsl:attribute>
                              <xsl:attribute name="name">
                                <xsl:value-of select="@data-name" />
                              </xsl:attribute>
                              <xsl:attribute name="value">
                                <xsl:value-of select="@value" />
                              </xsl:attribute>
                              <xsl:attribute name="data-value">
                                <xsl:value-of select="@data-value" />
                              </xsl:attribute>
                              <xsl:attribute name="class">
                                <xsl:value-of select="@class" />
                              </xsl:attribute>
                              <xsl:if test="@checked != ''">
                                <xsl:attribute name="checked">
                                  <xsl:value-of select="@checked" />
                                </xsl:attribute>
                              </xsl:if>
                            </input>
                            <label style="padding-left:5px;font-size:16px;">
                              <xsl:attribute name="for">
                                <xsl:value-of select="@data-id"/>
                              </xsl:attribute>
                              <xsl:value-of select="@label"/>
                            </label>
                          </div>
                        </xsl:for-each>
                      </div>
                    </xsl:if>
                    <xsl:if test="@Type='Button'">
                      <button>
                        <xsl:attribute name="id">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="name">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="type">
                          <xsl:value-of select="@btntype" />
                        </xsl:attribute>
                        <xsl:if test="@disabled != ''">
                          <xsl:attribute name="disabled">
                            <xsl:value-of select="@disabled" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="class">
                          <xsl:value-of select="@class" />
                        </xsl:attribute>
                        <xsl:if test="@click != ''">
                          <xsl:attribute name="onclick">
                            <xsl:value-of select="@click" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:value-of select="@text" />
                      </button>
                    </xsl:if>
                    <xsl:if test="@Type='CheckBox'">
                      <input type="checkbox">
                        <xsl:attribute name="id">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:attribute name="name">
                          <xsl:value-of select="@name" />
                        </xsl:attribute>
                        <xsl:if test="@checked != ''">
                          <xsl:attribute name="checked">
                            <xsl:value-of select="@checked" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@disabled != ''">
                          <xsl:attribute name="disabled">
                            <xsl:value-of select="@disabled" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@required != ''">
                          <xsl:attribute name="required">
                            <xsl:value-of select="@required" />
                          </xsl:attribute>
                        </xsl:if>
                        <xsl:attribute name="class">
                          <xsl:value-of select="@class" />
                        </xsl:attribute>
                        <xsl:if test="@onchange != ''">
                          <xsl:attribute name="onchange">
                            <xsl:value-of select="@onchange" />
                          </xsl:attribute>
                        </xsl:if>
                      </input>
                    </xsl:if>
                    <xsl:if test="@Type='BreakLine'">
                      <div class="col-sm-12 spaceCss"></div>
                    </xsl:if>
                    <span class="errMsgLbl pull-right" style="color:red;"></span>
                  </div>
                </xsl:for-each>
                <div class="col-sm-12">
                  <xsl:attribute name="id">
                    <xsl:value-of select="concat('nav_',@id)"/>
                  </xsl:attribute>
                  <div class="col-sm-12">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  </div>
                </div>
              </form>
            </div>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:for-each>
    </div>
  </xsl:template>
</xsl:stylesheet>