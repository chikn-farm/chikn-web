import * as React from 'react'
import {
  useWeb3Contract,
  useIsPublicMintOpenQuery,
  useIsGBMintOpenQuery,
  useToggleOpenForGBMutation,
  useToggleOpenForPublicMutation,
  useGetExcludedMutation,
  useSetExcludedMutation,
  useAirdropMutation,
  useChangeUrlMutation,
  useBaseUrlQuery
} from '../components/Connect'
import Layout from '../components/Layout'
import {
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton
} from 'react-bootstrap'

const Admin = () => {
  const { contract, account, active } = useWeb3Contract()
  const { isLoading: publicLoading, data: publicStatus } = useIsPublicMintOpenQuery(contract, account, active)
  const { isLoading: gbLoading, data: gbStatus } = useIsGBMintOpenQuery(contract, account, active)
  const { data: currentBaseURL } = useBaseUrlQuery(contract, account, active)

  const [address, setAddress] = React.useState('')
  const [freeAddress, setFreeAddress] = React.useState('')
  const [includeInWhiteList, setIncludeInWhiteList] = React.useState(false)
  const [baseUrl, setBaseUrl] = React.useState('')
  const [airdropAddress, setAirdropAddress] = React.useState('')
  const [numberOfAirDrop, setNumberOfAirDrop] = React.useState(1)

  const useToggleGB = useToggleOpenForGBMutation(contract, active)
  const useTogglePublic = useToggleOpenForPublicMutation(contract, active)
  const useGetExcluded = useGetExcludedMutation(contract, active)
  const useSetExclude = useSetExcludedMutation(contract, active)
  const useSendAirdrop = useAirdropMutation(contract, active)
  const useChangeUrl = useChangeUrlMutation(contract, active)

  const toggleGB = () => {
    useToggleGB.mutate({ isOpen: !gbStatus })
  }

  const togglePublic = () => {
    useTogglePublic.mutate({ isOpen: !publicStatus })
  }

  const checkExclude = () => {
    useGetExcluded.mutate({ address: address })
  }

  const setExclude = () => {
    useSetExclude.mutate({
      address: freeAddress,
      status: includeInWhiteList
    })
  }

  const sendAirdrop = () => {
    useSendAirdrop.mutate({
      numberOfToken: numberOfAirDrop,
      address: airdropAddress
    })
  }

  const updateBaseUrl = () => {
    useChangeUrl.mutate({
      url: baseUrl
    })
  }

  return (
    <Layout pageName="Admin">
      <h1>-- Admin --</h1>

      <h2>Opening for market</h2>
      <div>Is GB mint open: <span>{publicLoading
        ? (
          <Spinner animation="border" />
        )
        : `${gbStatus}`} </span>
      <Button
        title="GB Toggle"
        variant="success"
        disabled={!active || useToggleGB.isLoading}
        onClick={toggleGB}>
        {useToggleGB.isLoading ? <Spinner animation="border" /> : 'Toggle'}
      </Button>
      {
        useToggleGB.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(useToggleGB.error.data.message)}
        </Alert>
      }
      </div>

      <div>Is Public mint open: <span>{gbLoading
        ? (
          <Spinner animation="border" />
        )
        : `${publicStatus}`} </span>
      <Button
        title="Public Toggle"
        variant="success"
        disabled={!active || useTogglePublic.isLoading}
        onClick={togglePublic}>
        {useTogglePublic.isLoading ? <Spinner animation="border" /> : 'Toggle'}
      </Button>
      {
        useTogglePublic.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(useTogglePublic.error.data.message)}
        </Alert>
      }
      </div>

      <hr />
      {/* Check excluded list */}
      <h2>Check Excluded list</h2>
      <div>
        <span></span>
        <Form.Group className="my-4" controlId="formBasicEmail">
          <Form.Label>Check address is in exclude list or not </Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button
              title="Public Toggle"
              variant="success"
              disabled={!active || useGetExcluded.isLoading}
              onClick={checkExclude}>
              {useGetExcluded.isLoading ? <Spinner animation="border" /> : 'Check'}
            </Button>
          </InputGroup>
        </Form.Group>
        {
          useGetExcluded.isSuccess && <Alert variant="success" className="mt-4">
            {JSON.stringify(useGetExcluded.data)}
          </Alert>
        }
      </div>

      <hr />
      {/* Free excluding (add / remove) */}
      <h2>Free Excluding (Add/Remove)</h2>
      <div>
        <Form.Group className="my-4" controlId="formBasicEmail">
          <Form.Label>Add / remove wallet address to the exclude list (Free minting)</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="0x..."
              value={freeAddress}
              onChange={(e) => setFreeAddress(e.target.value)}
            />
          </InputGroup>

          <ToggleButtonGroup
            type="radio"
            name="excludeList"
            defaultValue={includeInWhiteList}
            className="mb-2 d-flex"
            onChange={(e) => setIncludeInWhiteList(e)}
            value={includeInWhiteList}>
            <ToggleButton
              id="tbg-check-2"
              className={`w-50 ${includeInWhiteList === true ? 'text-white' : ''
              }`}
              variant={
                'outline-success'
              }
              value={true}>
              Add
            </ToggleButton>
            <ToggleButton
              id="tbg-check-1"
              className={`w-50 ${includeInWhiteList === false ? 'text-white' : ''
              }`}
              variant={
                // enabledListing === true ? 'success' : 'outline-success'
                'outline-primary'
              }
              value={false}>
              Remove
            </ToggleButton>
          </ToggleButtonGroup>
        </Form.Group>
        <Button
          title="Update Exclude session"
          variant="success"
          disabled={!active || useSetExclude.isLoading}
          onClick={setExclude}>
          {useSetExclude.isLoading ? <Spinner animation="border" /> : 'Update'}
        </Button>
        {
          useSetExclude.isSuccess && <Alert variant="success" className="mt-4">
            {JSON.stringify(useSetExclude.data)}
          </Alert>
        }
        {
          useSetExclude.isError && <Alert variant="danger" className="mt-4">
            {JSON.stringify(useSetExclude.error.data.message)}
          </Alert>
        }
      </div>

      <hr />
      {/* AIRDROP */}
      <h2>Airdrop</h2>
      <Form.Group className="my-4" controlId="formBasicEmail">
        <Form.Label>Airdrop free token to the following address</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="0x..."
            value={airdropAddress}
            onChange={(e) => setAirdropAddress(e.target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control
            type="number"
            placeholder="1"
            value={numberOfAirDrop}
            onChange={(e) => setNumberOfAirDrop(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Button
        title="Send airdrop"
        variant="success"
        disabled={!active || useSendAirdrop.isLoading}
        onClick={sendAirdrop}>
        {useSendAirdrop.isLoading ? <Spinner animation="border" /> : 'Send'}
      </Button>
      {
        useSendAirdrop.isSuccess && <Alert variant="success" className="mt-4">
          {JSON.stringify(useSendAirdrop.data)}
        </Alert>
      }
      {
        useSendAirdrop.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(useSendAirdrop.error.data.message)}
        </Alert>
      }

      <hr />
      {/* Change Base URL */}
      <h2>Change Base URL</h2>
      <Form.Group className="my-4" controlId="formBasicEmail">
        <Form.Label>Change base url - {currentBaseURL}</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="https://chikn.farm"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Button
        title="Update base url"
        variant="success"
        disabled={!active || useChangeUrl.isLoading}
        onClick={updateBaseUrl}>
        {useChangeUrl.isLoading ? <Spinner animation="border" /> : 'Update'}
      </Button>
      {
        useChangeUrl.isSuccess && <Alert variant="success" className="mt-4">
          {JSON.stringify(useChangeUrl.data)}
        </Alert>
      }
      {
        useChangeUrl.isError && <Alert variant="danger" className="mt-4">
          {JSON.stringify(useChangeUrl.error.data.message)}
        </Alert>
      }
    </Layout >
  )
}

export default Admin