@extends('layouts.app')

@section('title', '"' . Str::limit($quote->content, 60) . '" — QuotesHub')
@section('description', 'Quote by ' . $quote->author . ': ' . Str::limit($quote->content, 140))

@section('content')
<div class="app-main">
    <div class="feed-container" style="max-width: 680px;">

            {{-- Back button --}}
            <a href="{{ url()->previous() }}"
               class="inline-flex items-center gap-2 mb-6"
               style="font-size:14px;font-weight:500;color:#64748b;text-decoration:none;transition:color 0.2s ease;"
               onmouseover="this.style.color='#a78bfa'"
               onmouseout="this.style.color='#64748b'">
                <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back
            </a>

            {{-- Main quote card (large) --}}
            <x-quote-card :quote="$quote" size="large" />

            {{-- Stats row --}}
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px;">
                @foreach([
                    ['❤️', $quote->likes_count, 'Likes'],
                    ['💾', $quote->saves_count, 'Saves'],
                    ['👁️', $quote->views_count, 'Views'],
                ] as $stat)
                    <div class="panel-card" style="padding:16px;text-align:center;">
                        <div style="font-size:22px;margin-bottom:4px;">{{ $stat[0] }}</div>
                        <div style="font-size:22px;font-weight:800;color:#f1f5f9;">{{ $stat[1] }}</div>
                        <div style="font-size:12px;color:#64748b;">{{ $stat[2] }}</div>
                    </div>
                @endforeach
            </div>

            {{-- Author + meta --}}
            <div class="panel-card" style="margin-top:16px;">
                <div class="panel-card-header">About the Quote</div>
                <div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Author</span>
                        <span style="font-size:14px;font-weight:600;color:#e2e8f0;">{{ $quote->author }}</span>
                    </div>
                    @if($quote->source)
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Source</span>
                            <span style="font-size:14px;color:#94a3b8;font-style:italic;">{{ $quote->source }}</span>
                        </div>
                    @endif
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Posted by</span>
                        <a href="{{ route('profile.show', $quote->user->username) }}"
                           style="font-size:14px;font-weight:600;color:#a78bfa;text-decoration:none;transition:opacity 0.2s ease;"
                           onmouseover="this.style.opacity='0.7'"
                           onmouseout="this.style.opacity='1'">
                            {{ $quote->user->name }}
                        </a>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:13px;color:#64748b;width:80px;flex-shrink:0;">Date</span>
                        <span style="font-size:14px;color:#94a3b8;">{{ $quote->created_at->format('F j, Y') }}</span>
                    </div>
                </div>
            </div>

            {{-- Categories & Tags --}}
            @if($quote->categories->count() > 0 || ($quote->tags && $quote->tags->count() > 0))
                <div class="panel-card" style="margin-top:16px;">
                    @if($quote->categories->count() > 0)
                        <div style="padding:16px 20px 12px;">
                            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#475569;margin-bottom:10px;">Categories</div>
                            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                @foreach($quote->categories as $category)
                                    <a href="{{ route('category.show', $category->slug) }}" class="category-pill" style="font-size:13px;padding:5px 14px;">
                                        {{ $category->icon ?? '' }} {{ $category->name }}
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    @endif
                    @if($quote->tags && $quote->tags->count() > 0)
                        <div style="padding:12px 20px 16px; border-top: 1px solid var(--border-subtle);">
                            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#475569;margin-bottom:10px;">Tags</div>
                            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                @foreach($quote->tags as $tag)
                                    <span style="font-size:12px;padding:4px 12px;border-radius:99px;background:rgba(100,116,139,0.1);color:#94a3b8;border:1px solid rgba(100,116,139,0.2);">
                                        #{{ is_object($tag) ? $tag->name : $tag }}
                                    </span>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            @endif

            {{-- Owner/Admin actions --}}
            @if(auth()->check() && (auth()->id() === $quote->user_id || auth()->user()->is_admin))
                <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap;">
                    @if(auth()->id() === $quote->user_id)
                        <a href="{{ route('quotes.edit', $quote) }}" class="btn-ghost">
                            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit Quote
                        </a>
                    @endif
                    <form method="POST" action="{{ route('quotes.destroy', $quote) }}"
                          onsubmit="return confirm('Delete this quote? This cannot be undone.');">
                        @csrf
                        @method('DELETE')
                        <button type="submit"
                                class="btn-ghost"
                                style="border-color:rgba(239,68,68,0.4);color:#f87171;">
                            <svg style="width:16px;height:16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Delete
                        </button>
                    </form>
                </div>
            @endif

            {{-- Related quotes --}}
            @if($relatedQuotes ?? false)
                <div style="margin-top:32px;">
                    <div style="font-size:16px;font-weight:800;color:#f1f5f9;margin-bottom:16px;letter-spacing:-0.3px;">More Like This</div>
                    <div style="display:flex;flex-direction:column;gap:14px;">
                        @foreach($relatedQuotes as $relatedQuote)
                            <x-quote-card :quote="$relatedQuote" />
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- ===== COMMENTS SECTION ===== --}}
            <div style="margin-top:32px;" x-data="commentsSection({{ $quote->id }}, {{ auth()->check() ? 'true' : 'false' }}, {{ json_encode(auth()->user()?->name) }}, {{ json_encode(auth()->user()?->avatar) }})" x-init="init()">

                {{-- Header --}}
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <h2 style="font-size:16px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;">
                        💬 Comments <span style="font-size:14px;font-weight:500;color:#64748b;" x-text="'(' + total + ')'"></span>
                    </h2>
                </div>

                {{-- Comment input (authenticated users only) --}}
                @auth
                    <div class="panel-card" style="margin-bottom:20px;padding:16px;">
                        <div style="display:flex;gap:12px;align-items:flex-start;">
                            <img src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}"
                                 alt="{{ auth()->user()->name }}"
                                 style="width:36px;height:36px;border-radius:10px;object-fit:cover;flex-shrink:0;">
                            <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
                                <textarea
                                    x-model="newComment"
                                    @keydown.ctrl.enter="submitComment()"
                                    placeholder="Write a comment… (Ctrl+Enter to post)"
                                    rows="2"
                                    style="width:100%;background:var(--bg-elevated);border:1px solid var(--border-muted);border-radius:12px;padding:10px 14px;font-size:14px;color:#e2e8f0;resize:none;outline:none;transition:border-color 0.2s ease;font-family:inherit;"
                                    @focus="$el.style.borderColor='var(--brand-border)'"
                                    @blur="$el.style.borderColor='var(--border-muted)'"
                                ></textarea>
                                <div style="display:flex;justify-content:flex-end;">
                                    <button
                                        @click="submitComment()"
                                        :disabled="!newComment.trim() || submitting"
                                        class="btn-brand"
                                        style="font-size:13px;padding:8px 20px;"
                                        :style="!newComment.trim() || submitting ? 'opacity:0.5;cursor:not-allowed;' : ''"
                                    >
                                        <span x-show="!submitting">Post Comment</span>
                                        <span x-show="submitting">Posting…</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                @else
                    <div class="panel-card" style="margin-bottom:20px;padding:16px;text-align:center;">
                        <p style="font-size:14px;color:#64748b;margin-bottom:12px;">Sign in to join the conversation</p>
                        <a href="{{ route('login') }}" class="btn-brand" style="font-size:13px;padding:8px 24px;">Sign In</a>
                    </div>
                @endauth

                {{-- Loading skeleton --}}
                <div x-show="loading" class="flex flex-col gap-3">
                    @for($i = 0; $i < 3; $i++)
                        <div style="display:flex;gap:12px;padding:4px 0;">
                            <div style="width:36px;height:36px;border-radius:10px;background:var(--border-subtle);flex-shrink:0;" class="animate-pulse"></div>
                            <div style="flex:1;">
                                <div style="height:12px;border-radius:6px;background:var(--border-subtle);width:30%;margin-bottom:8px;" class="animate-pulse"></div>
                                <div style="height:14px;border-radius:6px;background:var(--border-subtle);width:80%;margin-bottom:6px;" class="animate-pulse"></div>
                                <div style="height:12px;border-radius:6px;background:var(--border-subtle);width:50%;" class="animate-pulse"></div>
                            </div>
                        </div>
                    @endfor
                </div>

                {{-- Comments list --}}
                <div x-show="!loading" class="flex flex-col gap-4">
                    <template x-for="comment in comments" :key="comment.id">
                        <div style="display:flex;gap:12px;">
                            {{-- Avatar --}}
                            <a :href="'/' + comment.user.username" style="flex-shrink:0;">
                                <img :src="comment.user.avatar || '/images/default-avatar.png'"
                                     :alt="comment.user.name"
                                     style="width:36px;height:36px;border-radius:10px;object-fit:cover;">
                            </a>

                            {{-- Comment body --}}
                            <div style="flex:1;min-width:0;">
                                <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:14px;padding:12px 16px;">
                                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:8px;">
                                        <a :href="'/' + comment.user.username"
                                           style="font-size:13px;font-weight:700;color:#e2e8f0;text-decoration:none;"
                                           x-text="comment.user.name"></a>
                                        <span style="font-size:11px;color:#475569;flex-shrink:0;" x-text="timeAgo(comment.created_at)"></span>
                                    </div>
                                    <p style="font-size:14px;color:#cbd5e1;line-height:1.6;word-break:break-word;" x-text="comment.body"></p>
                                </div>

                                {{-- Actions --}}
                                <div style="display:flex;align-items:center;gap:14px;margin-top:6px;padding:0 4px;">
                                    @auth
                                        <button
                                            @click="toggleReply(comment)"
                                            style="font-size:12px;font-weight:600;color:#64748b;background:none;border:none;cursor:pointer;padding:0;transition:color 0.2s ease;"
                                            onmouseover="this.style.color='#a78bfa'"
                                            onmouseout="this.style.color='#64748b'"
                                        >Reply</button>
                                        <template x-if="{{ auth()->id() }} === comment.user_id || {{ auth()->user()?->is_admin ? 'true' : 'false' }}">
                                            <button
                                                @click="deleteComment(comment)"
                                                style="font-size:12px;font-weight:600;color:#64748b;background:none;border:none;cursor:pointer;padding:0;transition:color 0.2s ease;"
                                                onmouseover="this.style.color='#f87171'"
                                                onmouseout="this.style.color='#64748b'"
                                            >Delete</button>
                                        </template>
                                    @endauth
                                    <span style="font-size:12px;color:#475569;" x-show="comment.replies && comment.replies.length > 0" x-text="comment.replies.length + ' repl' + (comment.replies.length === 1 ? 'y' : 'ies')"></span>
                                </div>

                                {{-- Reply input --}}
                                @auth
                                    <div x-show="replyingTo === comment.id" x-transition style="margin-top:10px;display:flex;gap:10px;align-items:flex-start;">
                                        <img src="{{ auth()->user()->avatar ?? '/images/default-avatar.png' }}"
                                             alt="{{ auth()->user()->name }}"
                                             style="width:28px;height:28px;border-radius:8px;object-fit:cover;flex-shrink:0;">
                                        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
                                            <textarea
                                                x-model="replyBody"
                                                @keydown.ctrl.enter="submitReply(comment)"
                                                :placeholder="'Reply to ' + comment.user.name + '…'"
                                                rows="2"
                                                style="width:100%;background:var(--bg-elevated);border:1px solid var(--border-muted);border-radius:10px;padding:8px 12px;font-size:13px;color:#e2e8f0;resize:none;outline:none;font-family:inherit;"
                                                @focus="$el.style.borderColor='var(--brand-border)'"
                                                @blur="$el.style.borderColor='var(--border-muted)'"
                                            ></textarea>
                                            <div style="display:flex;gap:8px;justify-content:flex-end;">
                                                <button @click="replyingTo=null;replyBody=''" class="btn-ghost" style="font-size:12px;padding:6px 14px;">Cancel</button>
                                                <button @click="submitReply(comment)" :disabled="!replyBody.trim()" class="btn-brand" style="font-size:12px;padding:6px 14px;">Post Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                @endauth

                                {{-- Replies --}}
                                <template x-if="comment.replies && comment.replies.length > 0">
                                    <div style="margin-top:12px;display:flex;flex-direction:column;gap:10px;padding-left:8px;border-left:2px solid var(--border-subtle);">
                                        <template x-for="reply in comment.replies" :key="reply.id">
                                            <div style="display:flex;gap:10px;">
                                                <a :href="'/' + reply.user.username" style="flex-shrink:0;">
                                                    <img :src="reply.user.avatar || '/images/default-avatar.png'"
                                                         :alt="reply.user.name"
                                                         style="width:28px;height:28px;border-radius:8px;object-fit:cover;">
                                                </a>
                                                <div style="flex:1;min-width:0;">
                                                    <div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:12px;padding:10px 14px;">
                                                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;gap:8px;">
                                                            <a :href="'/' + reply.user.username"
                                                               style="font-size:12px;font-weight:700;color:#e2e8f0;text-decoration:none;"
                                                               x-text="reply.user.name"></a>
                                                            <span style="font-size:11px;color:#475569;" x-text="timeAgo(reply.created_at)"></span>
                                                        </div>
                                                        <p style="font-size:13px;color:#cbd5e1;line-height:1.6;word-break:break-word;" x-text="reply.body"></p>
                                                    </div>
                                                    @auth
                                                        <template x-if="{{ auth()->id() }} === reply.user_id || {{ auth()->user()?->is_admin ? 'true' : 'false' }}">
                                                            <button
                                                                @click="deleteReply(comment, reply)"
                                                                style="font-size:11px;font-weight:600;color:#64748b;background:none;border:none;cursor:pointer;padding:4px 4px 0;transition:color 0.2s ease;"
                                                                onmouseover="this.style.color='#f87171'"
                                                                onmouseout="this.style.color='#64748b'"
                                                            >Delete</button>
                                                        </template>
                                                    @endauth
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>

                    {{-- Empty state --}}
                    <div x-show="!loading && comments.length === 0" style="text-align:center;padding:40px 20px;">
                        <div style="font-size:40px;margin-bottom:12px;">💭</div>
                        <p style="font-size:14px;color:#64748b;">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

@push('scripts')
<script>
function commentsSection(quoteId, isAuth, authName, authAvatar) {
    return {
        quoteId,
        isAuth,
        authName,
        authAvatar,
        comments: @json($comments),
        total: {{ $comments->count() }},
        loading: false,
        newComment: '',
        submitting: false,
        replyingTo: null,
        replyBody: '',

        init() {
            // Comments already loaded server-side, no fetch needed
        },

        timeAgo(dateStr) {
            if (!dateStr) return '';
            const diff = (Date.now() - new Date(dateStr)) / 1000;
            if (diff < 60) return 'Just now';
            if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
            if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
            if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
            return new Date(dateStr).toLocaleDateString();
        },

        async submitComment() {
            if (!this.newComment.trim() || this.submitting) return;
            this.submitting = true;
            try {
                const res = await axios.post(`/api/quotes/${this.quoteId}/comments`, {
                    body: this.newComment,
                });
                const comment = res.data.comment;
                comment.replies = [];
                this.comments.unshift(comment);
                this.total++;
                this.newComment = '';
            } catch (e) {
                alert(e.response?.data?.message || 'Failed to post comment.');
            } finally {
                this.submitting = false;
            }
        },

        toggleReply(comment) {
            if (this.replyingTo === comment.id) {
                this.replyingTo = null;
                this.replyBody = '';
            } else {
                this.replyingTo = comment.id;
                this.replyBody = '';
            }
        },

        async submitReply(comment) {
            if (!this.replyBody.trim()) return;
            try {
                const res = await axios.post(`/api/quotes/${this.quoteId}/comments`, {
                    body: this.replyBody,
                    parent_id: comment.id,
                });
                if (!comment.replies) comment.replies = [];
                comment.replies.push(res.data.comment);
                this.total++;
                this.replyingTo = null;
                this.replyBody = '';
            } catch (e) {
                alert(e.response?.data?.message || 'Failed to post reply.');
            }
        },

        async deleteComment(comment) {
            if (!confirm('Delete this comment?')) return;
            try {
                await axios.delete(`/api/comments/${comment.id}`);
                this.comments = this.comments.filter(c => c.id !== comment.id);
                this.total--;
            } catch (e) {
                alert('Failed to delete comment.');
            }
        },

        async deleteReply(comment, reply) {
            if (!confirm('Delete this reply?')) return;
            try {
                await axios.delete(`/api/comments/${reply.id}`);
                comment.replies = comment.replies.filter(r => r.id !== reply.id);
                this.total--;
            } catch (e) {
                alert('Failed to delete reply.');
            }
        },
    };
}
</script>
@endpush
@endsection