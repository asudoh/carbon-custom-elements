# Supporting RTL

## Basics

- We generate RTL version of CSS using [RTLCSS](https://github.com/MohammadYounes/rtlcss) library
- Need to see whether we should put flipped version opt-in or include OOTB - How much CSS size increason do we see?

## Additional considerations

- Does [the discussion of RTL inheritance in shadow tree](https://github.com/whatwg/html/issues/3699) affect us?
- [CSS specificity problem](https://github.com/MohammadYounes/rtlcss/wiki/Why-make-a-complete-RTL-version-%3F)
- Should we ship RTL version of CSS given we ship CSS?
- Or should we ship the original Sass code to allow style customization for RTL?
- Should we provide a guide with build settings to dependency-inject an alternate style for RTL?
- Should we use `src/globals/settings.ts` to switch LTR/RTL CSS? e.g. `static styles = settings.useRTLStyles ? rtlStyles : ltrStyles`

## Useful links

https://html.spec.whatwg.org/#the-directionality
