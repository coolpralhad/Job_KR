"use client"
import { useLang } from "@/lib/i18n/context"

/* ──────────────────────────────────────────────────────────────────────────── */
/*  Korean — exact content from ok-korea.co.kr/privacy.php                     */
/* ──────────────────────────────────────────────────────────────────────────── */

function PrivacyKo() {
  return (
    <div className="prose-content">
      <h1>개인정보처리방침</h1>
      <p className="meta">오케이코리아는 회원님의 개인정보를 소중히 생각하며, 관련 법령에 따라 안전하게 보호하고 있습니다.</p>
      <p className="meta"><strong>시행일자:</strong> 2025년 1월 1일 &nbsp;|&nbsp; <strong>최종 수정일:</strong> 2025년 7월 25일 &nbsp;|&nbsp; <strong>개인정보보호책임자:</strong> 김호연 (changhyeok@naver.com)</p>
      <hr />

      <h2>1. 개인정보의 처리목적</h2>
      <p>오케이코리아(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
      <h3>가. 홈페이지 회원가입 및 관리</h3>
      <ul><li>회원 가입의사 확인</li><li>회원제 서비스 제공에 따른 본인 식별·인증</li><li>회원자격 유지·관리</li><li>서비스 부정이용 방지</li><li>각종 고지·통지</li><li>고충처리</li></ul>
      <h3>나. 재화 또는 서비스 제공</h3>
      <ul><li>강의 서비스 제공</li><li>콘텐츠 제공</li><li>맞춤서비스 제공</li><li>본인인증</li><li>요금결제·정산</li><li>채권추심</li></ul>
      <h3>다. 마케팅 및 광고에의 활용</h3>
      <ul><li>신규 서비스(제품) 개발 및 맞춤 서비스 제공</li><li>이벤트 및 광고성 정보 제공 및 참여기회 제공</li><li>인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li><li>서비스의 유효성 확인</li><li>접속빈도 파악 또는 회원의 서비스 이용에 대한 통계</li></ul>
      <hr />

      <h2>2. 개인정보의 처리 및 보유기간</h2>
      <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
      <div className="table-wrap"><table>
        <thead><tr><th>처리목적</th><th>개인정보의 항목</th><th>보유기간</th></tr></thead>
        <tbody>
          <tr><td>홈페이지 회원가입 및 관리</td><td>이름, 이메일, 전화번호, 비밀번호</td><td>회원탈퇴 시까지</td></tr>
          <tr><td>재화 또는 서비스 제공</td><td>이름, 이메일, 결제정보, 수강이력</td><td>서비스 제공완료 후 5년</td></tr>
          <tr><td>마케팅 및 광고 활용</td><td>이름, 이메일, 서비스 이용기록</td><td>동의철회 시까지</td></tr>
          <tr><td>법령에 따른 보관</td><td>계약 또는 청약철회 등에 관한 기록</td><td>5년</td></tr>
        </tbody>
      </table></div>
      <hr />

      <h2>3. 처리하는 개인정보의 항목</h2>
      <h3>가. 필수항목</h3>
      <ul><li><strong>이름:</strong> 회원 식별 및 서비스 제공</li><li><strong>이메일주소:</strong> 로그인 ID, 서비스 관련 안내</li><li><strong>비밀번호:</strong> 본인인증 및 보안</li><li><strong>휴대전화번호:</strong> 본인인증, 중요 안내사항 전달</li></ul>
      <h3>나. 선택항목</h3>
      <ul><li><strong>생년월일:</strong> 맞춤형 서비스 제공</li><li><strong>성별:</strong> 통계분석 및 맞춤형 서비스 제공</li><li><strong>관심분야:</strong> 개인화된 콘텐츠 추천</li><li><strong>프로필 사진:</strong> 서비스 이용 편의성 증대</li></ul>
      <h3>다. 자동 수집 항목</h3>
      <ul><li>IP주소, 쿠키, MAC주소, 서비스 이용기록</li><li>접속 로그, 접속 국가정보</li><li>불량 이용 기록</li></ul>
      <h3>라. 결제정보 (유료서비스 이용 시)</h3>
      <ul><li>신용카드번호, 은행계좌정보</li><li>결제승인번호, 결제일시</li></ul>
      <p>결제정보는 암호화되어 저장되며, 결제 완료 후 즉시 파기됩니다.</p>
      <hr />

      <h2>4. 개인정보의 제3자 제공</h2>
      <p>회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한 범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 목적 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.</p>
      <p>다만, 다음의 경우에는 예외로 합니다:</p>
      <ol><li>정보주체로부터 별도의 동의를 받은 경우</li><li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li><li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에 있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서 명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요하다고 인정되는 경우</li><li>통계작성 및 학술연구 등의 목적을 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 개인정보를 제공하는 경우</li></ol>
      <h3>현재 제3자 제공 현황</h3>
      <div className="table-wrap"><table>
        <thead><tr><th>제공받는 자</th><th>제공목적</th><th>제공항목</th><th>보유·이용기간</th></tr></thead>
        <tbody><tr><td>토스페이먼츠(주)</td><td>강의·용품 등 유료서비스 결제 처리 및 결제내역 관리</td><td>이름, 결제정보</td><td>재화·서비스 공급 완료 및 관련 법령상 보존기간까지</td></tr></tbody>
      </table></div>
      <hr />

      <h2>5. 개인정보처리의 위탁 및 국외 이전</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>수탁자</th><th>위탁 업무</th><th>보유·이용기간</th></tr></thead>
        <tbody>
          <tr><td>Google LLC</td><td>이메일(SMTP) 발송 — 회원가입 인증, 서비스 안내</td><td>위탁계약 종료 시까지</td></tr>
          <tr><td>아이코드(icode)</td><td>SMS(문자메시지) 발송</td><td>위탁계약 종료 시까지</td></tr>
          <tr><td>Cloudflare, Inc.</td><td>영상 콘텐츠 스트리밍 및 전송(CDN)</td><td>위탁계약 종료 시까지</td></tr>
        </tbody>
      </table></div>
      <h3>개인정보의 국외 이전</h3>
      <div className="table-wrap"><table>
        <thead><tr><th>이전받는 자</th><th>이전 국가</th><th>이전 항목</th><th>이용목적</th><th>보유·이용기간</th></tr></thead>
        <tbody>
          <tr><td>Cloudflare, Inc.</td><td>미국</td><td>IP주소, 단말·접속정보, 영상 시청기록</td><td>영상 콘텐츠 스트리밍 및 전송(CDN)</td><td>이용목적 달성 또는 위탁계약 종료 시까지</td></tr>
          <tr><td>Google LLC</td><td>미국</td><td>이름, 이메일주소</td><td>이메일(SMTP) 발송</td><td>이용목적 달성 또는 위탁계약 종료 시까지</td></tr>
        </tbody>
      </table></div>
      <p><strong>국외 이전 거부 방법:</strong> 회원은 고객센터(changhyeok@naver.com) 또는 회원 탈퇴를 통해 개인정보의 국외 이전을 거부할 수 있습니다. 다만 영상 강의 등 일부 서비스 이용이 제한될 수 있습니다.</p>
      <hr />

      <h2>6. 정보주체의 권리·의무</h2>
      <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
      <h3>가. 개인정보 처리현황 통지요구</h3>
      <p>정보주체는 개인정보보호법 제35조에 따른 개인정보의 처리현황 통지를 요구할 수 있습니다.</p>
      <h3>나. 개인정보 열람요구</h3>
      <p>정보주체는 개인정보보호법 제35조에 따른 개인정보의 열람을 요구할 수 있으며, 회사는 이에 지체 없이 응합니다.</p>
      <h3>다. 개인정보 정정·삭제요구</h3>
      <p>정보주체는 개인정보보호법 제36조에 따른 개인정보의 정정·삭제를 요구할 수 있습니다.</p>
      <h3>라. 개인정보 처리정지 요구</h3>
      <p>정보주체는 개인정보보호법 제37조에 따른 개인정보의 처리정지를 요구할 수 있습니다.</p>
      <p>권리 행사는 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다. 권리 행사는 법정대리인이나 위임을 받은 자를 통하여 하실 수도 있습니다.</p>
      <hr />

      <h2>7. 개인정보의 파기</h2>
      <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
      <h3>가. 파기절차</h3>
      <ul><li>회원님이 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li><li>DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.</li></ul>
      <h3>나. 파기기한</h3>
      <ul><li>이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에 파기합니다.</li><li>개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 파기합니다.</li></ul>
      <h3>다. 파기방법</h3>
      <ul><li><strong>전자적 파일:</strong> 로우레벨포맷(Low Level Format) 등의 방법으로 복구 불가능하게 파기</li><li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각하여 파기</li></ul>
      <hr />

      <h2>8. 개인정보의 안전성 확보조치</h2>
      <p>회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</p>
      <ul>
        <li><strong>개인정보 취급 직원의 최소화 및 교육:</strong> 개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화하여 관리합니다.</li>
        <li><strong>정기적인 자체 감사 실시:</strong> 개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.</li>
        <li><strong>내부관리계획의 수립 및 시행:</strong> 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</li>
        <li><strong>개인정보의 암호화:</strong> 비밀번호는 암호화 되어 저장 및 관리되고 있으며, 중요한 데이터는 별도 보안기능을 사용합니다.</li>
        <li><strong>해킹 등에 대비한 기술적 대책:</strong> 보안프로그램 설치 및 주기적인 갱신·점검을 실시합니다.</li>
        <li><strong>개인정보에 대한 접근 제한:</strong> 접근권한의 부여, 변경, 말소를 통한 접근통제 및 침입차단시스템을 운영합니다.</li>
        <li><strong>접속기록의 보관 및 위변조 방지:</strong> 개인정보처리시스템 접속 기록을 최소 1년 이상 보관합니다.</li>
        <li><strong>문서보안을 위한 잠금장치 사용:</strong> 개인정보가 포함된 서류 등을 잠금장치가 있는 안전한 장소에 보관합니다.</li>
      </ul>
      <hr />

      <h2>9. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
      <h3>가. 쿠키(Cookie)의 사용 목적</h3>
      <p>회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>
      <h3>나. 쿠키의 설치·운영 및 거부</h3>
      <ul><li>웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li><li>쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</li></ul>
      <h3>다. 웹 분석 도구</h3>
      <p>본 웹사이트는 Google Analytics를 사용하고 있습니다. Google Analytics는 웹사이트의 이용을 분석하기 위해 '쿠키'를 사용하며, 귀하의 웹사이트 사용에 관한 정보(IP 주소 포함)는 Google 서버로 전송되어 저장됩니다.</p>
      <h3>라. 모바일 앱에서의 광고식별자</h3>
      <p>모바일 앱에서는 맞춤형 광고 서비스 제공을 위해 광고식별자(ADID, IDFA)를 수집할 수 있으며, 이는 모바일 기기의 설정에서 차단하실 수 있습니다.</p>
      <hr />

      <h2>10. 개인정보보호책임자</h2>
      <div className="contact-box">
        <p><strong>성명:</strong> 김호연</p>
        <p><strong>직책:</strong> 대표이사</p>
        <p><strong>전화:</strong> 070-7012-2881</p>
        <p><strong>이메일:</strong> changhyeok@naver.com</p>
      </div>
      <p>정보주체께서는 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보보호책임자에 문의하실 수 있습니다.</p>
      <hr />

      <h2>11. 권익침해 구제방법</h2>
      <ul>
        <li><strong>개인정보보호위원회:</strong> (국번없이) 182 / privacy.go.kr</li>
        <li><strong>개인정보 침해신고센터:</strong> (국번없이) 118 / privacy.go.kr</li>
        <li><strong>개인정보 분쟁조정위원회:</strong> (국번없이) 1833-6972 / www.kopico.go.kr</li>
        <li><strong>대검찰청 사이버범죄수사단:</strong> 02-3480-3573 / www.spo.go.kr</li>
        <li><strong>경찰청 사이버테러대응센터:</strong> (국번없이) 182 / cyberbureau.police.go.kr</li>
        <li><strong>중앙행정심판위원회:</strong> (국번없이) 110 / www.simpan.go.kr</li>
      </ul>
      <hr />

      <h2>12. 개인정보처리방침 변경</h2>
      <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
      <h3>개정 이력</h3>
      <ul>
        <li><strong>v1.0 (2024년 1월 1일):</strong> 개인정보처리방침 최초 제정</li>
        <li><strong>v1.1 (2024년 7월 1일):</strong> 쿠키 사용 관련 조항 추가</li>
        <li><strong>v2.0 (2025년 1월 1일):</strong> 개인정보 보호 강화 정책 반영</li>
        <li><strong>v2.1 (2025년 7월 25일):</strong> 개인정보 처리 위탁업체 정보 업데이트</li>
      </ul>
      <hr />
      <div className="contact-box">
        <p className="font-semibold text-gray-700 mb-2">회사 정보</p>
        <p><strong>사업자명:</strong> 오케이코리아 &nbsp;|&nbsp; <strong>대표:</strong> 김호연 &nbsp;|&nbsp; <strong>사업자번호:</strong> 218-05-72997</p>
        <p><strong>본점:</strong> 대구광역시 수성구 수성로 367-2, 4층 4-38호(수성동1가)</p>
        <p><strong>교육장:</strong> 대구광역시 수성구 알파시티1로 42길 11, 태왕알파시티수성 B동 220, 221호</p>
        <p><strong>고객센터:</strong> 070-7012-2881 &nbsp;|&nbsp; <strong>이메일:</strong> changhyeok@naver.com</p>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  English translation                                                         */
/* ──────────────────────────────────────────────────────────────────────────── */

function PrivacyEn() {
  return (
    <div className="prose-content">
      <h1>Privacy Policy</h1>
      <p className="meta">OK Korea values your personal information and protects it safely in accordance with applicable laws and regulations.</p>
      <p className="meta"><strong>Effective:</strong> January 1, 2025 &nbsp;|&nbsp; <strong>Last updated:</strong> July 25, 2025 &nbsp;|&nbsp; <strong>Data Protection Officer:</strong> Kim Ho-yeon (changhyeok@naver.com)</p>
      <hr />

      <h2>1. Purpose of Processing Personal Data</h2>
      <p>OK Korea ("the Company") processes personal data for the following purposes. Personal data is not used for any purpose beyond those stated below. If the purpose changes, the Company will take necessary measures such as obtaining separate consent pursuant to Article 18 of the Personal Information Protection Act.</p>
      <h3>a. Website Membership Registration and Management</h3>
      <ul><li>Confirming intention to register as a member</li><li>Identity verification and authentication for membership services</li><li>Maintaining and managing member status</li><li>Preventing fraudulent use of the service</li><li>Notices and notifications</li><li>Handling grievances</li></ul>
      <h3>b. Provision of Goods or Services</h3>
      <ul><li>Lecture service provision</li><li>Content provision</li><li>Personalised service provision</li><li>Identity verification</li><li>Payment and settlement</li><li>Debt collection</li></ul>
      <h3>c. Marketing and Advertising</h3>
      <ul><li>Development of new services and provision of personalised services</li><li>Provision of event and promotional information and participation opportunities</li><li>Service provision and advertising based on demographic characteristics</li><li>Verifying service effectiveness</li><li>Tracking access frequency and statistics on member service use</li></ul>
      <hr />

      <h2>2. Retention Period</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Purpose</th><th>Data Items</th><th>Retention Period</th></tr></thead>
        <tbody>
          <tr><td>Membership registration and management</td><td>Name, email, phone number, password</td><td>Until account deletion</td></tr>
          <tr><td>Provision of goods or services</td><td>Name, email, payment information, course history</td><td>5 years after service completion</td></tr>
          <tr><td>Marketing and advertising</td><td>Name, email, service usage records</td><td>Until consent is withdrawn</td></tr>
          <tr><td>Legally required records</td><td>Records relating to contracts or withdrawal of subscription</td><td>5 years</td></tr>
        </tbody>
      </table></div>
      <hr />

      <h2>3. Personal Data Collected</h2>
      <h3>a. Required</h3>
      <ul><li><strong>Name:</strong> Member identification and service provision</li><li><strong>Email address:</strong> Login ID and service notifications</li><li><strong>Password:</strong> Identity authentication and security</li><li><strong>Mobile phone number:</strong> Identity verification and important notices</li></ul>
      <h3>b. Optional</h3>
      <ul><li><strong>Date of birth:</strong> Personalised service provision</li><li><strong>Gender:</strong> Statistical analysis and personalised services</li><li><strong>Areas of interest:</strong> Personalised content recommendations</li><li><strong>Profile photo:</strong> Improved service usability</li></ul>
      <h3>c. Automatically Collected</h3>
      <ul><li>IP address, cookies, MAC address, service usage records</li><li>Access logs, access country information</li><li>Records of misconduct</li></ul>
      <h3>d. Payment Information (for paid services)</h3>
      <ul><li>Credit card number, bank account information</li><li>Payment approval number, payment date and time</li></ul>
      <p>Payment information is stored encrypted and destroyed immediately after payment is completed.</p>
      <hr />

      <h2>4. Disclosure to Third Parties</h2>
      <p>The Company processes personal data only within the scope specified for the collection and use purposes, and does not provide personal data to third parties without the prior consent of the data subject, except in the following cases:</p>
      <ol><li>Where the data subject has given separate consent</li><li>Where there are special provisions in law or where it is unavoidable to comply with statutory obligations</li><li>Where it is clearly necessary to protect the urgent life, body, or property interests of the data subject or a third party</li><li>Where personal data is provided in a form that cannot identify specific individuals for statistical or academic research purposes</li></ol>
      <h3>Current Third-Party Disclosures</h3>
      <div className="table-wrap"><table>
        <thead><tr><th>Recipient</th><th>Purpose</th><th>Data Provided</th><th>Retention Period</th></tr></thead>
        <tbody><tr><td>Toss Payments Co., Ltd.</td><td>Processing payments for paid services and managing payment records</td><td>Name, payment information</td><td>Until supply of goods/services is complete and statutory retention period</td></tr></tbody>
      </table></div>
      <hr />

      <h2>5. Outsourcing and Cross-border Transfer</h2>
      <div className="table-wrap"><table>
        <thead><tr><th>Processor</th><th>Entrusted Work</th><th>Retention Period</th></tr></thead>
        <tbody>
          <tr><td>Google LLC</td><td>Email (SMTP) delivery — membership verification, service notifications</td><td>Until contract termination</td></tr>
          <tr><td>iCode</td><td>SMS message delivery</td><td>Until contract termination</td></tr>
          <tr><td>Cloudflare, Inc.</td><td>Video content streaming and delivery (CDN)</td><td>Until contract termination</td></tr>
        </tbody>
      </table></div>
      <h3>Cross-border Transfer</h3>
      <div className="table-wrap"><table>
        <thead><tr><th>Recipient</th><th>Country</th><th>Data</th><th>Purpose</th><th>Retention</th></tr></thead>
        <tbody>
          <tr><td>Cloudflare, Inc.</td><td>USA</td><td>IP address, device/access info, video viewing records</td><td>Video content streaming (CDN)</td><td>Until purpose achieved or contract ends</td></tr>
          <tr><td>Google LLC</td><td>USA</td><td>Name, email address</td><td>Email (SMTP) delivery</td><td>Until purpose achieved or contract ends</td></tr>
        </tbody>
      </table></div>
      <p><strong>How to refuse cross-border transfer:</strong> Members may refuse the cross-border transfer of personal data by contacting customer service (changhyeok@naver.com) or deleting their account. Note that some services such as video lectures may be restricted.</p>
      <hr />

      <h2>6. Rights of Data Subjects</h2>
      <p>Data subjects may exercise the following rights against the Company at any time: notification of processing status, access, correction/deletion, and suspension of processing. Rights may be exercised in writing, by email, or fax, and the Company will respond without delay. Rights may also be exercised through a legal representative or authorised agent.</p>
      <hr />

      <h2>7. Disposal of Personal Data</h2>
      <p>When personal data becomes unnecessary due to expiry of the retention period or achievement of the processing purpose, it will be destroyed without delay.</p>
      <ul>
        <li><strong>Procedure:</strong> Data is moved to a separate DB after its purpose is achieved and stored for the required period before destruction.</li>
        <li><strong>Deadline:</strong> Within 5 days of expiry of the retention period, or within 5 days from when processing is deemed unnecessary.</li>
        <li><strong>Electronic files:</strong> Destroyed using low-level formatting so records cannot be recovered.</li>
        <li><strong>Paper documents:</strong> Shredded or incinerated.</li>
      </ul>
      <hr />

      <h2>8. Security Measures</h2>
      <ul>
        <li><strong>Minimisation and training:</strong> Personal data is handled by designated staff only.</li>
        <li><strong>Quarterly internal audits:</strong> Regular self-audits are conducted every quarter.</li>
        <li><strong>Internal management plan:</strong> A plan for safe personal data processing is established and implemented.</li>
        <li><strong>Encryption:</strong> Passwords are encrypted; important data uses additional security features.</li>
        <li><strong>Anti-hacking measures:</strong> Security programs are installed and regularly updated.</li>
        <li><strong>Access controls:</strong> Access to databases is controlled via permission management and intrusion prevention systems.</li>
        <li><strong>Access log retention:</strong> Access logs are retained for at least 1 year.</li>
        <li><strong>Physical security:</strong> Documents containing personal data are stored in locked facilities.</li>
      </ul>
      <hr />

      <h2>9. Cookies and Automatic Data Collection</h2>
      <p>The Company uses cookies to provide personalised services. You may refuse cookies via your browser settings (Tools &gt; Internet Options &gt; Privacy), though this may affect personalised service features.</p>
      <p>This website uses Google Analytics, which uses cookies to analyse usage. Information about your use of this website (including IP address) is transmitted to and stored on Google servers.</p>
      <p>Mobile apps may collect advertising identifiers (ADID, IDFA) for personalised advertising, which can be blocked in your device settings.</p>
      <hr />

      <h2>10. Data Protection Officer</h2>
      <div className="contact-box">
        <p><strong>Name:</strong> Kim Ho-yeon</p>
        <p><strong>Title:</strong> CEO</p>
        <p><strong>Phone:</strong> 070-7012-2881</p>
        <p><strong>Email:</strong> changhyeok@naver.com</p>
      </div>
      <p>You may contact the Data Protection Officer for any privacy-related inquiries, complaints, or requests for remedy arising from your use of the service.</p>
      <hr />

      <h2>11. Remedies for Rights Violations</h2>
      <ul>
        <li><strong>Personal Information Protection Commission:</strong> 182 (toll-free) / privacy.go.kr</li>
        <li><strong>Personal Information Infringement Report Centre:</strong> 118 (toll-free) / privacy.go.kr</li>
        <li><strong>Personal Information Dispute Mediation Committee:</strong> 1833-6972 / www.kopico.go.kr</li>
        <li><strong>Supreme Prosecutors' Office Cybercrime Investigation Division:</strong> 02-3480-3573 / www.spo.go.kr</li>
        <li><strong>National Police Agency Cyber Terror Response Centre:</strong> 182 (toll-free) / cyberbureau.police.go.kr</li>
        <li><strong>Central Administrative Appeals Commission:</strong> 110 (toll-free) / www.simpan.go.kr</li>
      </ul>
      <hr />

      <h2>12. Changes to This Policy</h2>
      <p>This Privacy Policy is effective from its date of implementation. Any additions, deletions, or corrections will be announced through notices at least 7 days before the changes take effect.</p>
      <h3>Revision History</h3>
      <ul>
        <li><strong>v1.0 (January 1, 2024):</strong> Initial privacy policy established</li>
        <li><strong>v1.1 (July 1, 2024):</strong> Cookie usage provisions added</li>
        <li><strong>v2.0 (January 1, 2025):</strong> Enhanced privacy protection policy reflected</li>
        <li><strong>v2.1 (July 25, 2025):</strong> Data processor information updated</li>
      </ul>
      <hr />
      <div className="contact-box">
        <p className="font-semibold text-gray-700 mb-2">Company Information</p>
        <p><strong>Company:</strong> OK Korea &nbsp;|&nbsp; <strong>CEO:</strong> Kim Ho-yeon &nbsp;|&nbsp; <strong>Business No.:</strong> 218-05-72997</p>
        <p><strong>Address:</strong> 4F-38, 367-2 Suseong-ro, Suseong-gu, Daegu</p>
        <p><strong>Training Centre:</strong> B-220/221, Taewang Alpha City Suseong, 42-gil 11, Alphacity 1-ro, Suseong-gu, Daegu</p>
        <p><strong>Phone:</strong> 070-7012-2881 &nbsp;|&nbsp; <strong>Email:</strong> changhyeok@naver.com</p>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────── */

export default function PrivacyPage() {
  const { lang } = useLang()
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <style>{`
        .prose-content { color: #374151; }
        .prose-content h1 { font-size: 1.75rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; }
        .prose-content h2 { font-size: 1.1rem; font-weight: 700; color: #1f2937; margin-top: 2rem; margin-bottom: 0.75rem; padding-bottom: 0.25rem; border-bottom: 1px solid #e5e7eb; }
        .prose-content h3 { font-size: 0.95rem; font-weight: 600; color: #374151; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .prose-content p { font-size: 0.875rem; line-height: 1.7; margin-bottom: 0.75rem; }
        .prose-content ul, .prose-content ol { padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .prose-content li { font-size: 0.875rem; line-height: 1.7; margin-bottom: 0.25rem; }
        .prose-content ul li { list-style-type: disc; }
        .prose-content ol li { list-style-type: decimal; }
        .prose-content hr { border-color: #e5e7eb; margin: 1.5rem 0; }
        .prose-content .meta { font-size: 0.8rem; color: #6b7280; }
        .prose-content .table-wrap { overflow-x: auto; margin-bottom: 1rem; }
        .prose-content table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .prose-content th { background: #f3f4f6; font-weight: 600; text-align: left; padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; }
        .prose-content td { padding: 0.5rem 0.75rem; border: 1px solid #e5e7eb; vertical-align: top; }
        .prose-content .contact-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem 1.25rem; margin-bottom: 1rem; }
        .prose-content .contact-box p { margin-bottom: 0.25rem; font-size: 0.875rem; }
      `}</style>
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white px-8 py-10 shadow-sm">
        {lang === "ko" ? <PrivacyKo /> : <PrivacyEn />}
      </div>
    </div>
  )
}
