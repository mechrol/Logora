import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { 
  PlusIcon, 
  LightBulbIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assumption: '',
    theorem: '',
    proof: '',
    conclusion: '',
    category: 'proposal'
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:author_id (
            full_name,
            username
          ),
          project_votes (
            id,
            vote_type,
            user_id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      toast.error('Error fetching projects')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) return

    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...formData,
          author_id: user.id,
          status: 'draft'
        }])

      if (error) throw error

      setFormData({
        title: '',
        description: '',
        assumption: '',
        theorem: '',
        proof: '',
        conclusion: '',
        category: 'proposal'
      })
      setShowCreateForm(false)
      fetchProjects()
      toast.success('Project created successfully!')
    } catch (error) {
      toast.error('Error creating project')
      console.error('Error:', error)
    }
  }

  const handleVote = async (projectId, voteType) => {
    try {
      const existingVote = projects
        .find(p => p.id === projectId)
        ?.project_votes?.find(v => v.user_id === user.id)

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from('project_votes')
            .delete()
            .eq('id', existingVote.id)
        } else {
          // Update vote
          await supabase
            .from('project_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id)
        }
      } else {
        // Add new vote
        await supabase
          .from('project_votes')
          .insert([{
            project_id: projectId,
            user_id: user.id,
            vote_type: voteType
          }])
      }

      fetchProjects()
    } catch (error) {
      toast.error('Error voting on project')
      console.error('Error:', error)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'in_review':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Democratic Projects</h1>
          <p className="text-gray-600">Propose, vote, and implement community-driven projects</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Project
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Project Title"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="proposal">Proposal</option>
                <option value="research">Research</option>
                <option value="implementation">Implementation</option>
                <option value="policy">Policy</option>
              </select>
            </div>
            
            <textarea
              placeholder="Project Description"
              className="input"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            {/* Scientific Framework */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Scientific Framework (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <textarea
                  placeholder="Assumption: What do we assume to be true?"
                  className="input"
                  rows={2}
                  value={formData.assumption}
                  onChange={(e) => setFormData({ ...formData, assumption: e.target.value })}
                />
                <textarea
                  placeholder="Theorem: What principle or rule applies?"
                  className="input"
                  rows={2}
                  value={formData.theorem}
                  onChange={(e) => setFormData({ ...formData, theorem: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <textarea
                  placeholder="Proof: How can we validate this?"
                  className="input"
                  rows={2}
                  value={formData.proof}
                  onChange={(e) => setFormData({ ...formData, proof: e.target.value })}
                />
                <textarea
                  placeholder="Conclusion: What is the expected outcome?"
                  className="input"
                  rows={2}
                  value={formData.conclusion}
                  onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => {
          const upvotes = project.project_votes?.filter(v => v.vote_type === 'up').length || 0
          const downvotes = project.project_votes?.filter(v => v.vote_type === 'down').length || 0
          const userVote = project.project_votes?.find(v => v.user_id === user.id)

          return (
            <div key={project.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>By {project.profiles?.full_name || 'Anonymous'}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {getStatusIcon(project.status)}
              </div>

              {/* Scientific Framework */}
              {(project.assumption || project.theorem || project.proof || project.conclusion) && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <LightBulbIcon className="h-4 w-4 mr-2" />
                    Scientific Framework
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {project.assumption && (
                      <div>
                        <strong className="text-gray-700">Assumption:</strong>
                        <p className="text-gray-600 mt-1">{project.assumption}</p>
                      </div>
                    )}
                    {project.theorem && (
                      <div>
                        <strong className="text-gray-700">Theorem:</strong>
                        <p className="text-gray-600 mt-1">{project.theorem}</p>
                      </div>
                    )}
                    {project.proof && (
                      <div>
                        <strong className="text-gray-700">Proof:</strong>
                        <p className="text-gray-600 mt-1">{project.proof}</p>
                      </div>
                    )}
                    {project.conclusion && (
                      <div>
                        <strong className="text-gray-700">Conclusion:</strong>
                        <p className="text-gray-600 mt-1">{project.conclusion}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Voting */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleVote(project.id, 'up')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      userVote?.vote_type === 'up'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span>👍</span>
                    <span className="text-sm">{upvotes}</span>
                  </button>

                  <button
                    onClick={() => handleVote(project.id, 'down')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      userVote?.vote_type === 'down'
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span>👎</span>
                    <span className="text-sm">{downvotes}</span>
                  </button>

                  <div className="text-sm text-gray-500">
                    Score: {upvotes - downvotes}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="btn-secondary text-sm">
                    View Details
                  </button>
                  <button className="btn-primary text-sm">
                    Support Project
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="card text-center py-12">
          <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Start the democratic process by proposing your first project!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create First Project
          </button>
        </div>
      )}
    </div>
  )
}

export default Projects
