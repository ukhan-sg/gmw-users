import { useState } from 'react'
import axios from 'axios'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Checkbox,
  Chip,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material'

import { FormQuestionDiv, MainFormDiv, SectionFormTitle } from '../styles/forms'
import { ErrorText } from '../styles/typography'
import ButtonSubmit from './ButtonSubmit'
import { mapDataForApi } from '../library/mapDataForApi'
import { siteBackground as questions } from '../data/questions'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidation } from '../validation/multiSelectWithOther'

const ProjectDetailsForm = () => {
  const validationSchema = yup.object().shape({
    stakeholders: yup
      .array()
      .of(
        yup.object().shape({
          stakeholderType: yup.string(),
          stackholderName: yup.string()
        })
      )
      .min(1)
      .required('Select at least one stakeholder'),
    managementStatus: yup.string(),
    lawStatus: yup.string(),
    managementArea: yup.string(),
    protectionStatus: multiselectWithOtherValidation,
    areStakeholdersInvolved: yup.string(),
    govermentArrangement: yup.array().of(yup.string()),
    landTenure: multiselectWithOtherValidation,
    customaryRights: yup.string()
  })

  const reactHookFormInstance = useForm({
    defaultValues: {
      protectionStatus: { selectedValues: [], otherValue: undefined },
      landTenure: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    control
  } = reactHookFormInstance

  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control })

  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)

    const url = `${process.env.REACT_APP_API_URL}/sites/1/registration_answers`

    if (!data) return

    axios
      .put(url, mapDataForApi('siteBackground', data))
      .then(() => {
        setisSubmitting(false)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
      })
  }

  const handleStakeholdersOnChange = (event, stakeholder) => {
    if (event.target.checked) {
      stakeholdersAppend({ stakeholderType: stakeholder })
    } else {
      const index = stakeholdersFields.findIndex((field) => field.stakeholderType === stakeholder)
      stakeholdersRemove(index)
    }
  }

  const getStakeholder = (stakeholder) =>
    stakeholdersFields.find((field) => field.stakeholderType === stakeholder)

  return (
    <MainFormDiv>
      {/* Select Stakeholders */}
      <SectionFormTitle>Site Background Form</SectionFormTitle>
      <form onSubmit={validateInputs(handleSubmit)}>
        <FormQuestionDiv>
          <FormLabel>{questions.stakeholders.question}</FormLabel>
          <List>
            {questions.stakeholders.options.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      onChange={(event) =>
                        handleStakeholdersOnChange(event, stakeholder)
                      }></Checkbox>
                    <Typography variant='subtitle'>{stakeholder}</Typography>
                  </Box>
                  <Box>
                    {getStakeholder(stakeholder) && (
                      <Controller
                        name={`stakeholders.${stakeholdersFields.findIndex(
                          (field) => field.stakeholderType === stakeholder
                        )}.stakeholderName`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            sx={{ marginTop: '1em' }}
                            label='Name'
                            variant='outlined'
                            {...field}
                          />
                        )}
                      />
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
          <ErrorText>{errors.stakeholders?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Select Management Status*/}
        <FormQuestionDiv>
          <FormLabel>{questions.managementStatus.question}</FormLabel>
          <Controller
            name='managementStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.managementStatus.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.managementStatus?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Law recognition */}
        <FormQuestionDiv>
          <FormLabel>{questions.lawStatus.question}</FormLabel>
          <Controller
            name='lawStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.lawStatus.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.lawStatus?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Management Area*/}
        <FormQuestionDiv>
          <FormLabel>{questions.managementArea.question}</FormLabel>
          <Controller
            name='managementArea'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} value={field.value}></TextField>}
          />
          <ErrorText>{errors.managementArea?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Protection Status*/}
        <CheckboxGroupWithLabelAndController
          fieldName='protectionStatus'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.protectionStatus.options}
          question={questions.protectionStatus.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.protectionStatus?.selectedValues?.message}</ErrorText>
        {/* areStakeholdersInvolved */}
        <FormQuestionDiv>
          <FormLabel>{questions.areStakeholdersInvolved.question}</FormLabel>
          <Controller
            name='areStakeholdersInvolved '
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.areStakeholdersInvolved.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText variant='subtitle' sx={{ color: 'red' }}>
            {errors.areStakeholdersInvolved?.message}
          </ErrorText>
        </FormQuestionDiv>
        {/* Government Arrangement */}
        <FormQuestionDiv>
          <FormLabel>{questions.govermentArrangement.question}</FormLabel>
          <Controller
            name='governmentArrangement'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                value={field.value}
                label='select'
                input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}>
                {questions.govermentArrangement.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <ErrorText>{errors.govermentArrangement?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Land Tenure */}
        <CheckboxGroupWithLabelAndController
          fieldName='landTenure'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.landTenure.options}
          question={questions.landTenure.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.protectionStatus?.selectedValues?.message}</ErrorText>
        {/* customaryRights */}
        <FormQuestionDiv>
          <FormLabel>{questions.customaryRights.question}</FormLabel>
          <Controller
            name='customaryRights'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.customaryRights.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.customaryRights?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm