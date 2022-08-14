import { For } from 'solid-js'
import { IconClose } from '@components/Icons'
import { Navigation, Pagination, Scrollbar, A11y, Keyboard } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/solid'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/a11y'
import 'swiper/css/scrollbar'
import 'swiper/css/keyboard'

const DialogSliderScreenshots = (props) => {
  const { slider } = props

  return (
    <>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="min-h-screen px-4 flex items-center justify-center">
          <div class="bg-black bg-opacity-90 fixed inset-0" />
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <div
            class={`z-10 relative inline-block w-full max-w-screen overflow-hidden align-middle`}
            {...props.api().underlayProps}
          >
            <div {...props.api().contentProps}>
              <button
                class="absolute rounded-full text-xl flex items-center justify-center z-10 inline-end-0 top-0 lg:top-2 lg:inline-end-2"
                {...props.api().closeButtonProps}
              >
                <IconClose />
              </button>
              <h2 class="sr-only" {...props.api().titleProps}>
                Game screenshots
              </h2>
              <p class="sr-only" {...props.api().descriptionProps}>
                A slider with the screenshots of the game is displayed below.
              </p>

              <Swiper
                initialSlide={props.initialSlide()}
                modules={[Navigation, Keyboard, Pagination, Scrollbar, A11y]}
                navigation
                keyboard
                rewind={true}
                cssMode={true}
                slideActiveClass="swiper-slide-active animate-appear"
                centeredSlides={true}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                slidesPerView={1}
              >
                <For each={props.images}>
                  {(image) => (
                    <SwiperSlide>
                      <img alt="" class="max-w-full max-h-full" src={image} />
                    </SwiperSlide>
                  )}
                </For>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DialogSliderScreenshots
