(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();class u{container;articles;onClick;constructor(e,t,o){this.container=e,this.articles=t,this.onClick=o,t.length>0?this.render():this.renderLoadingState()}setArticles(e){this.articles=e,this.render()}appendArticles(e){this.articles.push(...e),this.appendArticleElements(e)}render(){this.clearContainer();const e=this.createArticleListElement();this.container.appendChild(e)}clearContainer(){this.container.innerHTML=""}createArticleListElement(){const e=document.createElement("div");e.className="article-list";const t=document.createDocumentFragment();return this.articles.forEach(o=>{const r=this.createArticleItem(o);t.appendChild(r)}),e.appendChild(t),e}createArticleItem(e){const t=document.createElement("div");return t.innerHTML=`
        <div class="entry" id=${e.docid}>
    <h3><a href="${e.url}" target="a41" id="${e.docid}">${e.title}</a></h3>
    <h4>from ${e.ch_title} on ${e.published}</h4>
    <p>${e.summary}</p>
    <hr />
        `,this.attachLinkClickHandler(t,e),t}attachLinkClickHandler(e,t){const o=e.querySelector("a");o&&o.addEventListener("click",()=>{this.onClick(t)})}appendArticleElements(e){const t=this.container.querySelector(".article-list");if(!t){this.render();return}const o=document.createDocumentFragment();e.forEach(r=>{const i=this.createArticleItem(r);o.appendChild(i)}),t.appendChild(o)}renderLoadingState(){this.container.innerHTML=`
            <div class="loading-state">
                <p>로딩 중...</p>
            </div>
        `}renderErrorState(e){this.container.innerHTML=`
            <div class="error-state">
                <p>오류: ${e}</p>
                <button onclick="window.location.reload()">새로고침</button>
            </div>
        `}}const d="a41-user-id";async function p(n){const t=new TextEncoder().encode(n),o=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(o)).map(s=>s.toString(16).padStart(2,"0")).join("")}async function f(){const n=Date.now().toString();return await p(n)}function h(){try{return localStorage.getItem(d)}catch(n){return console.warn("localStorage에 접근할 수 없습니다:",n),null}}function m(n){try{localStorage.setItem(d,n)}catch(e){console.warn("localStorage에 사용자 ID를 저장할 수 없습니다:",e)}}async function g(){let n=h();return n?console.log("기존 사용자 ID를 사용합니다:",n):(n=await f(),m(n),console.log("새로운 사용자 ID가 생성되었습니다:",n)),n}function A(){return h()}const y={api:{baseUrl:"https://a41.4four.us",endpoints:{load:"/load2/",next:"/next2/",click:"/click/"}},app:{name:"나만을 위한 읽을거리 A41"}},l=y,a=(n,e)=>{const t=l.api.baseUrl,o=l.api.endpoints[n],r=`${t}${o}`,i=A(),s=i?`user_id=${i}`:"";let c="";return e&&s?c=`${e}&${s}`:e?c=e:s&&(c=s),c?`${r}?${c}`:r};class w{articleList;constructor(){this.initializeApp()}async initializeApp(){await g(),this.initializeDOM(),await this.initializeComponents()}initializeDOM(){this.renderHeader(),this.renderFooter()}async initializeComponents(){this.articleList=new u(this.getRequiredElement("#content"),[],this.handleArticleClick.bind(this));try{const e=await this.getArticleData();this.articleList.setArticles(e)}catch(e){console.error("초기 데이터 로딩 실패:",e),this.articleList.renderErrorState(e instanceof Error?e.message:"데이터 로딩에 실패했습니다")}}renderHeader(){this.getRequiredElement("#header").innerHTML=`
            <div id="header">
                <center><h2>${l.app.name}</h2></center>
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
        `,e.querySelector("#next-button")?.addEventListener("click",()=>{this.loadNextArticle()})}async getArticleData(){const e=await fetch(a("load"),{headers:{Accept:"application/json"},credentials:"include"});if(!e.ok)throw new Error(`서버 응답 오류: ${e.status} ${e.statusText}`);const t=await e.json();return console.log(t),t}getRequiredElement(e){const t=document.querySelector(e);if(!t)throw new Error(`필수 DOM 요소를 찾을 수 없습니다: ${e}`);return t}async handleArticleClick(e){console.log("선택된 문서:",e);try{const t=await fetch(a("click",`id=${e.docid}`),{headers:{Accept:"application/json"},credentials:"include"});if(!t.ok)throw new Error(`API 호출 실패: ${t.status} ${t.statusText}`);console.log(`클릭 API 호출 성공: docid=${e.docid}`)}catch(t){console.error("클릭 API 호출 중 오류:",t)}}async loadNextArticle(){console.log("다음 글 로딩 요청");const e=await fetch(a("next"),{headers:{Accept:"application/json"},credentials:"include"});if(!e.ok)throw new Error(`서버 응답 오류: ${e.status} ${e.statusText}`);const t=await e.json();this.articleList.appendArticles(t)}}document.addEventListener("DOMContentLoaded",()=>{new w});
