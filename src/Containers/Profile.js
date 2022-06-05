import React,{useEffect,useState} from 'react';
import Link from '../Components/Link';
import List from '../Components/List';
import styled from 'styled-components';

const ProfileWrapper = styled.div`
  width: 50%;
  margin: 10px auto;
`;

const Avatar = styled.img`
  width: 150px;
`;

function Profile() {
    const [git, setGit] = useState({
        data:{},
        repoitories:[],
        loading:true,
        error:''
    })
    useEffect(() => {
        let mounted = true
        async function fetchData(){
            if(mounted){
                try {
                    const profile = await  fetch('https://api.github.com/users/krishnaraosvv');
                    const profileJSON = await profile.json();
                        
                    if(profileJSON){
                        const repos = await fetch(profileJSON.repos_url);
                        const repoJSON = await repos.json();
                        console.log(repoJSON)
                            setGit({
                                ...git,
                                data:profileJSON,
                                repoitories:repoJSON,
                                loading:false
                            })
                    }
                } catch (error) {
                    setGit({
                        loading:false,
                        error:error.message
                    })
                                
                }
            }
        }
        fetchData()
        return function cleanup() {
            mounted = false
        }
    }, [git])
    if(git.loading || git.error){
        return <>{git.loading ? 'Loading...' : git.error}</>;
    }

    const items=[
        {label:'html_url',value:<Link url={git.data.html_url} title='Github URL'/>},
        {label:'respos_url',value:git.data.repos_url},
        {label:'name:',value:git.data.name},
        {label:'location',value:git.data.location},
        {label:'email:',value:git.data.email},
        {label:'public_repos:',value:git.data.public_repos},
        {label:'created_at',value:git.data.created_at}
    ]
    const projects=git.repoitories.map(respository=>({
        label:respository.name,
        value:<Link url={respository.html_url} title='Github URL' />
    }))
    return (

            <ProfileWrapper>
                <Avatar className="Profile-avatar" src={git.data.avatar_url}></Avatar>
                <List title='Profile' items={items}/>
                <List title='Projects' items={projects}/>
            </ProfileWrapper>
    )
}

export default Profile;
