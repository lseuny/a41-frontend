(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();class l{container;articles;onClick;constructor(e,t,i){this.container=e,this.articles=t,this.onClick=i,t.length>0?this.render():this.renderLoadingState()}setArticles(e){this.articles=e,this.render()}appendArticles(e){this.articles.push(...e),this.appendArticleElements(e)}render(){this.clearContainer();const e=this.createArticleListElement();this.container.appendChild(e)}clearContainer(){this.container.innerHTML=""}createArticleListElement(){const e=document.createElement("div");e.className="article-list";const t=document.createDocumentFragment();return this.articles.forEach(i=>{const r=this.createArticleItem(i);t.appendChild(r)}),e.appendChild(t),e}createArticleItem(e){const t=document.createElement("div");return t.innerHTML=`
        <div class="entry" id=${e.docid}>
    <h3><a href="${e.url}" target="a41" id="${e.docid}">${e.title}</a></h3>
    <h4>from ${e.channel_title} on ${e.published}</h4>
    <p>${e.summary}</p>
    <hr />
        `,this.attachLinkClickHandler(t,e),t}attachLinkClickHandler(e,t){const i=e.querySelector("a");i&&i.addEventListener("click",()=>{this.onClick(t)})}appendArticleElements(e){const t=this.container.querySelector(".article-list");if(!t){this.render();return}const i=document.createDocumentFragment();e.forEach(r=>{const n=this.createArticleItem(r);i.appendChild(n)}),t.appendChild(i)}renderLoadingState(){this.container.innerHTML=`
            <div class="loading-state">
                <p>로딩 중...</p>
            </div>
        `}renderErrorState(e){this.container.innerHTML=`
            <div class="error-state">
                <p>오류: ${e}</p>
                <button onclick="window.location.reload()">새로고침</button>
            </div>
        `}}const d={api:{baseUrl:"https://a41.4four.us",endpoints:{load:"/load2/",next:"/next2/",click:"/click/"}},app:{name:"나만을 위한 읽을거리 A41"}},a=d,c=(o,e)=>{const t=a.api.baseUrl,i=a.api.endpoints[o],r=`${t}${i}`;return e?`${r}?${e}`:r};class h{articleList;constructor(){this.initializeDOM(),this.initializeComponents()}initializeDOM(){this.renderHeader(),this.renderFooter()}async initializeComponents(){this.articleList=new l(this.getRequiredElement("#content"),[],this.handleArticleClick.bind(this));try{const e=await this.getArticleData();this.articleList.setArticles(e)}catch(e){console.error("초기 데이터 로딩 실패:",e),this.articleList.renderErrorState(e instanceof Error?e.message:"데이터 로딩에 실패했습니다")}}renderHeader(){this.getRequiredElement("#header").innerHTML=`
            <div id="header">
                <center><h2>${a.app.name}</h2></center>
                <div>
                    <a href="https://4four.us/article/2014/05/a41">이게 뭔가요?</a> |
                    &nbsp;<a href="https://discobook.4four.us" target="_blank">Book</a>
                </div>
                <hr />
            </div>
        `}renderFooter(){const e=this.getRequiredElement("#footer");e.innerHTML=`
            <div id="footer">
                <center><button type="button" id="next-button">다음 글 보기</button></center>
            </div>
        `,e.querySelector("#next-button")?.addEventListener("click",()=>{this.loadNextArticle()})}async getArticleData(){const e=await fetch(c("load"),{headers:{Accept:"application/json"},credentials:"include"});if(!e.ok)throw new Error(`서버 응답 오류: ${e.status} ${e.statusText}`);const t=await e.json();return console.log(t),t}getRequiredElement(e){const t=document.querySelector(e);if(!t)throw new Error(`필수 DOM 요소를 찾을 수 없습니다: ${e}`);return t}async handleArticleClick(e){console.log("선택된 문서:",e);try{const t=await fetch(c("click",`id=${e.docid}`));if(!t.ok)throw new Error(`API 호출 실패: ${t.status} ${t.statusText}`);console.log(`클릭 API 호출 성공: docid=${e.docid}`)}catch(t){console.error("클릭 API 호출 중 오류:",t)}}async loadNextArticle(){console.log("다음 글 로딩 요청");const e=await fetch(c("next"),{headers:{Accept:"application/json"},credentials:"include"});if(!e.ok)throw new Error(`서버 응답 오류: ${e.status} ${e.statusText}`);const t=await e.json();this.articleList.appendArticles(t)}}document.addEventListener("DOMContentLoaded",()=>{new h});
