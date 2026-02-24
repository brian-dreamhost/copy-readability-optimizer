/**
 * Truncation preview mockups for different platforms
 * Shows exactly where text gets cut off in a realistic platform UI mockup
 */

function SerpPreview({ text, limit, type }) {
  const truncated = text.length > limit

  return (
    <div className="bg-white rounded-lg p-4 max-w-xl">
      {type === 'title' ? (
        <>
          <div className="text-[#1a0dab] text-lg leading-snug font-normal hover:underline cursor-pointer">
            {truncated ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/20 text-coral">...</span>
              </>
            ) : (
              text || 'Your page title appears here'
            )}
          </div>
          <div className="text-[#006621] text-sm mt-1">www.example.com</div>
          <div className="text-[#545454] text-sm mt-0.5 leading-snug">
            Your meta description would appear in this area below the title...
          </div>
        </>
      ) : (
        <>
          <div className="text-[#1a0dab] text-lg leading-snug font-normal">
            Page Title - Example Site
          </div>
          <div className="text-[#006621] text-sm mt-1">www.example.com</div>
          <div className="text-[#545454] text-sm mt-0.5 leading-snug">
            {truncated ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/20 text-coral font-medium">...</span>
              </>
            ) : (
              text || 'Your meta description will appear here in Google search results...'
            )}
          </div>
        </>
      )}
    </div>
  )
}

function TwitterPreview({ text, limit }) {
  const truncated = text.length > limit
  return (
    <div className="bg-black border border-[#2f3336] rounded-2xl p-4 max-w-md">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#333] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-sm">Your Brand</span>
            <span className="text-[#71767b] text-sm">@yourbrand</span>
          </div>
          <div className="text-[#e7e9ea] text-[15px] leading-5 mt-1 break-words">
            {truncated ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/30 text-coral font-medium"> [truncated]</span>
              </>
            ) : (
              text || 'Your tweet will appear here...'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function GenericSocialPreview({ text, limit, platform }) {
  const truncated = text.length > limit
  const seeMoreThreshold = platform === 'instagram' ? 125 : platform === 'linkedin' ? 210 : 80

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 max-w-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#444] flex-shrink-0" />
        <div>
          <span className="text-white font-semibold text-sm">Your Brand</span>
          <div className="text-[#999] text-xs">Just now</div>
        </div>
      </div>
      <div className="text-[#e4e6eb] text-sm leading-relaxed break-words">
        {text.length > seeMoreThreshold ? (
          <>
            <span>{text.slice(0, seeMoreThreshold)}</span>
            <span className="text-[#0866ff] cursor-pointer text-sm font-normal">... See more</span>
            {truncated && (
              <div className="mt-2 text-xs text-coral">
                Text exceeds {limit.toLocaleString()} character limit by {(text.length - limit).toLocaleString()} characters
              </div>
            )}
          </>
        ) : (
          text || 'Your post will appear here...'
        )}
      </div>
    </div>
  )
}

function EmailPreview({ text, limit }) {
  const truncated = text.length > limit
  return (
    <div className="bg-white rounded-lg overflow-hidden max-w-md">
      <div className="bg-[#f2f2f2] px-4 py-2 border-b border-[#ddd]">
        <div className="text-[#333] text-xs">From: you@example.com</div>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[#333] text-sm font-semibold">Subject: </span>
          <span className="text-[#333] text-sm">
            {truncated ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/20 text-coral font-medium">...</span>
              </>
            ) : (
              text || 'Your email subject line...'
            )}
          </span>
        </div>
        <div className="text-[#999] text-xs mt-1">Preview text would appear here...</div>
      </div>
    </div>
  )
}

function SmsPreview({ text, limit }) {
  const truncated = text.length > limit
  const messageCount = Math.ceil(text.length / 160)
  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-[#007AFF] text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-snug break-words">
        {truncated ? (
          <>
            <span>{text.slice(0, limit)}</span>
            <span className="opacity-60"> [message {messageCount > 1 ? `split into ${messageCount} parts` : 'truncated'}]</span>
          </>
        ) : (
          text || 'Your SMS message...'
        )}
      </div>
      {text.length > 0 && (
        <div className="text-xs text-galactic mt-1.5 text-right">
          {text.length}/{limit} chars {messageCount > 1 && `(${messageCount} messages)`}
        </div>
      )}
    </div>
  )
}

function YoutubePreview({ text, limit }) {
  const truncated = text.length > limit
  return (
    <div className="max-w-md">
      <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
        <div className="bg-[#272727] aspect-video flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" className="w-12 h-12 opacity-30">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="p-3">
          <div className="text-white text-sm font-medium leading-snug">
            {truncated ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/20 text-coral">...</span>
              </>
            ) : (
              text || 'Your YouTube video title...'
            )}
          </div>
          <div className="text-[#aaa] text-xs mt-1">Your Channel &middot; 0 views &middot; Just now</div>
        </div>
      </div>
    </div>
  )
}

function GoogleAdsPreview({ text, limit, type }) {
  return (
    <div className="bg-white rounded-lg p-4 max-w-xl">
      <div className="text-xs text-[#006621] mb-0.5">Sponsored</div>
      {type === 'headline' ? (
        <>
          <div className="text-[#1a0dab] text-lg leading-snug">
            {text.length > limit ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/20 text-coral">...</span>
              </>
            ) : (
              text || 'Your Ad Headline'
            )}
            {' | '}
            <span className="text-[#999]">Second Headline</span>
          </div>
          <div className="text-[#006621] text-sm mt-1">www.example.com</div>
          <div className="text-[#545454] text-sm mt-0.5">Your ad description text would appear here...</div>
        </>
      ) : (
        <>
          <div className="text-[#1a0dab] text-lg leading-snug">
            Ad Headline | Your Brand
          </div>
          <div className="text-[#006621] text-sm mt-1">www.example.com</div>
          <div className="text-[#545454] text-sm mt-0.5 leading-snug">
            {text.length > limit ? (
              <>
                <span>{text.slice(0, limit)}</span>
                <span className="bg-coral/20 text-coral font-medium">...</span>
              </>
            ) : (
              text || 'Your ad description text would appear here...'
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function TruncationPreview({ text, platform }) {
  if (!text) {
    return (
      <div className="text-galactic text-sm italic py-4 text-center">
        Type or paste text above to see the truncation preview.
      </div>
    )
  }

  const { id, limit, preview } = platform

  switch (preview) {
    case 'serp':
      return <SerpPreview text={text} limit={limit} type={id === 'meta-title' ? 'title' : 'description'} />
    case 'twitter':
      return <TwitterPreview text={text} limit={limit} />
    case 'instagram':
    case 'facebook':
    case 'linkedin':
    case 'pinterest':
      return <GenericSocialPreview text={text} limit={limit} platform={preview} />
    case 'email':
      return <EmailPreview text={text} limit={limit} />
    case 'sms':
      return <SmsPreview text={text} limit={limit} />
    case 'youtube':
      return <YoutubePreview text={text} limit={limit} />
    case 'google-ads':
      return <GoogleAdsPreview text={text} limit={limit} type={id === 'google-ads-headline' ? 'headline' : 'description'} />
    default:
      return null
  }
}
