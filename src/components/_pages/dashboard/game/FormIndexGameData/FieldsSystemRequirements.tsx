import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'

export const FieldsSystemRequirements = (props) => {
  return (
    <>
      <FormField>
        <FormField.InputField>
          <div class="grid grid-cols-1 gap-8 pb-6 md:pb-0">
            <div class="col-span-1">
              <FormField.Label>
                Minimum system requirements
                <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
              </FormField.Label>
              <div class="space-y-4 mt-3">
                <label
                  for="minimumSystemRequirementsCpu"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">CPU</span>
                  <FormInput
                    value={props?.initialData?.minimumSystemRequirementsCpu}
                    placeholder="Intel Core i5-8400 | AMD Ryzen 3 3300X"
                    id="minimumSystemRequirementsCpu"
                    name="minimumSystemRequirementsCpu"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="minimumSystemRequirementsGpu"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">GPU</span>
                  <FormInput
                    value={props?.initialData?.minimumSystemRequirementsGpu}
                    placeholder="Nvidia GeForce GTX 1060, 3GB | AMD Radeon RX 580, 4GB"
                    id="minimumSystemRequirementsGpu"
                    name="minimumSystemRequirementsGpu"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="minimumSystemRequirementsOs"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">OS</span>
                  <FormInput
                    placeholder="eg: Windows 7 or newer"
                    value={props?.initialData?.minimumSystemRequirementsOs}
                    id="minimumSystemRequirementsOs"
                    name="minimumSystemRequirementsOs"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="minimumSystemRequirementsRam"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">RAM</span>
                  <FormInput
                    placeholder="eg: 8GB"
                    value={props?.initialData?.minimumSystemRequirementsRam}
                    id="minimumSystemRequirementsRam"
                    name="minimumSystemRequirementsRam"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="minimumSystemRequirementsStorage"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">Storage</span>
                  <FormInput
                    value={props?.initialData?.minimumSystemRequirementsStorage}
                    placeholder="eg: 60GB"
                    id="minimumSystemRequirementsStorage"
                    name="minimumSystemRequirementsStorage"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="minimumSystemRequirementsAdditionalNotes"
                  class="w-full flex-col flex text-2xs text-neutral-400 font-bold"
                >
                  <span class="pie-1ex pb-1">Additional notes</span>
                  <FormTextarea
                    value={props?.initialData?.minimumSystemRequirementsAdditionalNotes}
                    rows="10"
                    name="minimumSystemRequirementsAdditionalNotes"
                    id="minimumSystemRequirementsAdditionalNotes"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>
              </div>
            </div>
            <div class="col-span-1">
              <FormField.Label>
                Recommended system requirements
                <span class="font-medium text-neutral-400 text-2xs ">(optional)</span>
              </FormField.Label>
              <div class="space-y-4 mt-3">
                <label
                  for="recommendedSystemRequirementsCpu"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">CPU</span>
                  <FormInput
                    value={props?.initialData?.recommendedSystemRequirementsCpu}
                    placeholder="eg: Intel Core i7-8700K | AMD Ryzen 5 3600X"
                    name="recommendedSystemRequirementsCpu"
                    id="recommendedSystemRequirementsCpu"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="recommendedSystemRequirementsGpu"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">GPU</span>
                  <FormInput
                    value={props?.initialData?.recommendedSystemRequirementsGpu}
                    placeholder="eg: Nvidia GeForce GTX 1070, 8GB | AMD Radeon RX Vega 56, 8GB"
                    name="recommendedSystemRequirementsGpu"
                    id="recommendedSystemRequirementsGpu"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="recommendedSystemRequirementsOs"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">OS</span>
                  <FormInput
                    value={props?.initialData?.recommendedSystemRequirementsOs}
                    placeholder="eg: Windows 10"
                    name="recommendedSystemRequirementsOs"
                    id="recommendedSystemRequirementsOs"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="recommendedSystemRequirementsRam"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">RAM</span>
                  <FormInput
                    value={props?.initialData?.recommendedSystemRequirementsRam}
                    placeholder="eg: 16GB"
                    for="recommendedSystemRequirementsRam"
                    name="recommendedSystemRequirementsRam"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="recommendedSystemRequirementsStorage"
                  class="w-full flex text-2xs text-neutral-400 font-bold items-center"
                >
                  <span class="pie-1ex pb-1">Storage</span>
                  <FormInput
                    value={props?.initialData?.recommendedSystemRequirementsStorage}
                    placeholder="eg: 60GB"
                    id="recommendedSystemRequirementsStorage"
                    name="recommendedSystemRequirementsStorage"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>

                <label
                  for="recommendedSystemRequirementsAdditionalNotes"
                  class="w-full flex-col flex text-2xs text-neutral-400 font-bold"
                >
                  <span class="pie-1ex pb-1">Additional notes</span>
                  <FormTextarea
                    value={props?.initialData?.recommendedSystemRequirementsAdditionalNotes}
                    rows="10"
                    name="recommendedSystemRequirementsAdditionalNotes"
                    id="recommendedSystemRequirementsAdditionalNotes"
                    scale="sm"
                    class="w-full"
                    wrapperClass="w-full"
                  />
                </label>
              </div>
            </div>
          </div>
        </FormField.InputField>
        <FormField.HelpBlock id="input-description-helpblock">
          Specifying the minimum and recommended system requirements of your game isn't required.
        </FormField.HelpBlock>
      </FormField>
    </>
  )
}

export default FieldsSystemRequirements
