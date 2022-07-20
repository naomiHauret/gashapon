import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import { For, Show } from 'solid-js'
import Multiselect from '@components/Multiselect'
import GAME_GENRES from '@helpers/gameGenres'
import GAME_PRODUCTION_TYPES from '@helpers/gameTypes'
import GAME_PLATFORMS from '@helpers/gamePlatforms'
import GAME_DEVELOPMENT_STAGES from '@helpers/gameDevelopmentStages'
import GAME_PLAYER_MODES from '@helpers/gamePlayerModes'
import InputTags from '@components/InputTags'
import { RadioGroup, RadioGroupOption } from 'solid-headless'
import { IconCamera, IconCircleSolidClose } from '@components/Icons'
import FormSelect from '@components/FormSelect'

export const FieldsGameInfo = (props) => {
  return (
    <>
      <FormField>
        <FormField.InputField>
          <FormField.Label for="title">Title</FormField.Label>
          <FormField.Description id="input-title-description">The title of your game</FormField.Description>
          <FormInput
            type="text"
            name="title"
            id="title"
            class="w-full"
            aria-describedby="input-title-description input-title-helpblock"
            value={props?.initialData?.title}
            required
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-title-helpblock">A title is required.</FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <div class="flex flex-col lg:justify-between lg:flex-row lg:space-x-6">
            <div>
              <FormField.Label for="thumbnail">Game thumbnail</FormField.Label>
              <FormField.Description id="input-thumbnail-description">
                The main image that represents your game. <br />
                Click on the picture to upload a custom image from your files.
              </FormField.Description>
            </div>
            <div class="input-file_wrapper aspect-game-thumbnail w-48 rounded-md overflow-hidden relative bg-gray-100 bg-opacity-20">
              <input
                onChange={(e) => {
                  //@ts-ignore
                  props.onInputGameThumbnailChange(e.target.files[0])
                }}
                class="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                type="file"
                accept="image/*"
                name="thumbnail"
                id="thumbnail"
                aria-describedby="input-thumbnail-description input-thumbnail-helpblock"
              />
              <Show when={props.gameThumbnailSrc() !== null}>
                <button
                  onClick={props.removeThumbnail}
                  type="button"
                  class="absolute z-40 text-md top-0.5 inline-end-0.5 rounded-full p-0.5 text-neutral-100"
                >
                  <span class="sr-only">Remove thumbnail picture</span>
                  <IconCircleSolidClose />
                </button>
              </Show>
              <div class="absolute w-full h-full rounded-md inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
                <IconCamera class="text-2xl text-white" />
              </div>
              <Show when={props.gameThumbnailSrc() !== null}>
                <img
                  alt=""
                  loading="lazy"
                  width="112"
                  height="112"
                  class="absolute w-full h-full object-cover block z-10 inset-0"
                  src={props.gameThumbnailSrc()}
                />
              </Show>
            </div>
          </div>
        </FormField.InputField>
        <FormField.HelpBlock id="input-profile-picture-helpblock">
          Required. A 5:4 ratio picture. We recommend it to be less than 2MB.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label for="productionType">Production type</FormField.Label>
          <FormField.Description id="input-productionType-description">
            Is your game original, a fangame, a rom-hack ?
          </FormField.Description>
          <FormSelect
            name="productionType"
            id="productionType"
            class="w-full"
            aria-describedby="input-productionType-description input-productionType-helpblock"
            value={props?.initialData?.productionType}
            required
          >
            <option disabled>Select your game production type</option>
            <For each={Object.keys(GAME_PRODUCTION_TYPES)}>
              {/* @ts-ignore */}
              {(productionType) => (
                <option value={`${GAME_PRODUCTION_TYPES[productionType].value}`}>
                  {GAME_PRODUCTION_TYPES[productionType].label}
                </option>
              )}
            </For>
          </FormSelect>
        </FormField.InputField>
        <FormField.HelpBlock id="input-productionType-helpblock">
          Specifying the production type of your game is required.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label for="developmentTeam">Development team</FormField.Label>
          <FormField.Description id="input-developmentTeam-description">
            The name of the team behind this game.
          </FormField.Description>
          <FormInput
            type="text"
            name="developmentTeam"
            id="developmentTeam"
            class="w-full"
            aria-describedby="input-developmentTeam-description input-developmentTeam-helpblock"
            required
            value={props?.initialData?.developmentTeam}
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-developmentTeam-helpblock">
          The name of the development team is required.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label for="status">Status</FormField.Label>
          <FormField.Description id="input-status-description">
            The development stage of your game.
          </FormField.Description>
          <RadioGroup
            value={props.storeForm.data()?.status}
            onChange={(value) => {
              props.storeForm.setFields('status', `${value}`)
            }}
          >
            {({ isSelected, isActive }) => (
              <>
                <div class="space-y-6 pb-6">
                  <For each={Object.keys(GAME_DEVELOPMENT_STAGES)}>
                    {(stage) => (
                      <RadioGroupOption class="radio-pseudoIndicator" value={GAME_DEVELOPMENT_STAGES[stage].value}>
                        {({ isSelected: checked }) => (
                          <>
                            <span class="font-bold">{GAME_DEVELOPMENT_STAGES[stage].label}</span> -{' '}
                            {GAME_DEVELOPMENT_STAGES[stage].description}
                          </>
                        )}
                      </RadioGroupOption>
                    )}
                  </For>
                </div>
              </>
            )}
          </RadioGroup>
        </FormField.InputField>
        <FormField.HelpBlock id="input-status-helpblock">A status is required.</FormField.HelpBlock>
      </FormField>

      <FormField class="overflow-visible">
        <FormField.InputField>
          <FormField.Label for="genres">Genre</FormField.Label>
          <FormField.Description id="input-genres-description">
            Categories in which your game fits. You can pick up to 3 genres.
          </FormField.Description>
          <Multiselect
            class="scale--default"
            options={GAME_GENRES}
            selectedValues={props?.initialData?.genres ?? []}
            selectionLimit={3}
            onSelect={(newValuesSelected) => props.storeForm.setFields('genres', newValuesSelected)}
            onRemove={(newValuesSelected) => props.storeForm.setFields('genres', newValuesSelected)}
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-genres-helpblock">At least one genre, maximum 3.</FormField.HelpBlock>
      </FormField>

      <FormField class="overflow-visible">
        <FormField.InputField>
          <FormField.Label for="platforms">Platforms</FormField.Label>
          <FormField.Description id="input-platforms-description">
            The different platforms on which your game is available.
          </FormField.Description>
          <Multiselect
            class="scale--default"
            options={GAME_PLATFORMS}
            selectedValues={props?.initialData?.platforms ?? []}
            onSelect={(newValuesSelected) => props.storeForm.setFields('platforms', newValuesSelected)}
            onRemove={(newValuesSelected) => props.storeForm.setFields('platforms', newValuesSelected)}
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-platforms-helpblock">
          You must specify at least one platform.
        </FormField.HelpBlock>
      </FormField>

      <FormField class="overflow-visible">
        <FormField.InputField>
          <FormField.Label for="playerModes">Gameplay - player modes</FormField.Label>
          <FormField.Description id="input-playerModes-description">
            The different player modes available in your game.
          </FormField.Description>
          <Multiselect
            class="scale--default"
            selectedValues={props?.initialData?.playerModes ?? []}
            options={GAME_PLAYER_MODES}
            onSelect={(newValuesSelected) => props.storeForm.setFields('playerModes', newValuesSelected)}
            onRemove={(newValuesSelected) => props.storeForm.setFields('playerModes', newValuesSelected)}
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-playerModes-helpblock">
          You must specify at least one player mode.
        </FormField.HelpBlock>
      </FormField>

      <FormField class="overflow-visible">
        <FormField.InputField>
          <FormField.Label for="tags">Tags</FormField.Label>
          <FormField.Description id="input-tags-description">
            Any other keywords to describe your game.
          </FormField.Description>
          <InputTags placeholder="Type your game tags..." ref={props.refTagsInput} api={props.apiTagsInput} />
        </FormField.InputField>
        <FormField.HelpBlock id="input-tags-helpblock">Minimum 1 tag, maximum 10.</FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label for="tagline">Tagline</FormField.Label>
          <FormField.Description id="input-tagline-description">A few words about your game</FormField.Description>
          <FormTextarea
            name="tagline"
            id="tagline"
            class="w-full"
            maxlength="140"
            value={props?.initialData?.tagline}
            aria-describedby="input-tagline-description input-tagline-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-tagline-helpblock">
          Your game tagline must be maximum 140 characters.
        </FormField.HelpBlock>
      </FormField>

      <FormField>
        <FormField.InputField>
          <FormField.Label for="description">Description</FormField.Label>
          <FormField.Description id="input-description-description">A description of your game</FormField.Description>
          <FormTextarea
            rows="10"
            name="description"
            id="description"
            class="w-full"
            value={props?.initialData?.description}
            aria-describedby="input-description-description input-description-helpblock"
          />
        </FormField.InputField>
        <FormField.HelpBlock id="input-description-helpblock">A description is required.</FormField.HelpBlock>
      </FormField>
    </>
  )
}

export default FieldsGameInfo
